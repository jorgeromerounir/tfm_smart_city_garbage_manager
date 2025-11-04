package com.scgm.containers.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.containers.dto.BoundsDto;
import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerAddSendorDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerSearchParamsDto;
import com.scgm.containers.dto.ContainerStatusSummaryDto;
import com.scgm.containers.dto.ContainerUpdateDto;
import com.scgm.containers.dto.ContainerZoneUpdateDto;
import com.scgm.containers.entity.ContainerEntity;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;
import com.scgm.containers.exceptions.ContainerNotFoundException;
import com.scgm.containers.exceptions.ContainerValidationException;
import com.scgm.containers.exceptions.ContainersDatabaseException;
import com.scgm.containers.repository.ContainerRepository;
import com.scgm.containers.util.WasteLevelUtil;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class ContainerServiceImpl implements ContainerService {

    private final ContainerRepository containerRepository;

    @Override
    public ContainerDto add(ContainerAddDto containerAdd) {
        var reqListErrors = containerAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new ContainerValidationException("Trying to add: error container request validation.", reqListErrors);
        var containerEntity = ContainerAddDto.toEntity(containerAdd);
        var listErrors = containerEntity.validate();
        if (!listErrors.isEmpty())
            throw new ContainerValidationException("Trying to add: error container entity validation.", listErrors);
        try {
            return ContainerDto.toDto(containerRepository.save(containerEntity));
        } catch (Exception e) {
            log.error("Error trying to add container with id: {}", containerEntity.getId(), e);
            throw new ContainersDatabaseException("Error trying to add container", e);
        }
    }

    @Override
    public Optional<ContainerDto> findById(String id) {
        try {
            return containerRepository.findById(id).map(ContainerDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find container with ID: {}", id, e);
            throw new ContainersDatabaseException("Error trying to find container", e);
        }
    }

    @Override
    public List<ContainerDto> findByAddressContaining(String address) {
        try {
            List<ContainerEntity> containers = containerRepository.findByAddressContaining(address);
            return containers.stream().map(ContainerDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by address", e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    public List<ContainerDto> findByCityId(Long cityId) {
        try {
            return containerRepository.findByCityId(cityId).stream().map(ContainerDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by city ID: {}", cityId, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    public List<ContainerDto> findByCustomerId(Long customerId) {
        try {
            return containerRepository.findByCustomerId(customerId).stream().map(ContainerDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by customer ID: {}", customerId, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    public List<ContainerDto> findByCustomerIdAndCityId(Long customerId, Long cityId, Integer limit, Boolean hasZoneId) {
        try {
            if (limit == null || limit < 0)
                limit = 500;
            if (limit > 2000)
                limit = 2000;
            if (hasZoneId != null) {
                return containerRepository.findByCustomerIdAndCityIdWithZoneFilter(customerId, cityId, limit, hasZoneId)
                    .stream().map(ContainerDto::toDto)
                    .collect(Collectors.toList());
            }
            return containerRepository.findByCustomerIdAndCityId(customerId, cityId, limit)
                .stream().map(ContainerDto::toDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by customer ID: {} and city ID: {}", customerId, cityId, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    public List<ContainerDto> findByCustomerIdAndCityIdPaginated(Long customerId, Long cityId, ContainerSearchParamsDto searchParams) {
        var reqListErrors = searchParams.validate();
        if (!reqListErrors.isEmpty())
            throw new ContainerValidationException("Error in search parameters validation.", reqListErrors);
        
        log.info("Finding containers paginated for customer ID: {}, city ID: {} with search params", customerId, cityId);
        try {
            Integer limit = searchParams.getLimit();
            if (limit == null || limit < 0)
                limit = 500;
            if (limit > 2000)
                limit = 2000;
            String wasteLevelStatus = searchParams.getWasteLevelStatus() != null ? 
                searchParams.getWasteLevelStatus().toString() : null;
            return containerRepository.findByCustomerIdAndCityIdPaginatedDynamic(
                customerId, 
                cityId, 
                searchParams
            ).stream().map(ContainerDto::toDto)
            .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers paginated by customer ID: {} and city ID: {}", customerId, cityId, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    public List<ContainerDto> findByCustomerIdAndCityIdAndZoneId(Long customerId, Long cityId, String zoneId, Integer limit) {
        if (zoneId != null && !ContainerEntity.UUID_PATTERN.matcher(zoneId).matches())
            throw new ContainerValidationException("zoneId: invalid UUID format", List.of("zoneId: invalid UUID format"));
        log.info("Finding containers for customer ID: {}, city ID: {} and zone ID: {} with limit: {}", 
            customerId, cityId, zoneId, limit);
        try {
            if (limit == null)
                limit = 2000;
            return containerRepository.findByCustomerIdAndCityIdAndZoneId(customerId, cityId, zoneId, limit)
                    .stream().map(ContainerDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by customer ID: {}, city ID: {} and zone ID: {}", 
            customerId, cityId, zoneId, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    @Transactional
    public ContainerDto update(String containerId, ContainerUpdateDto containerUpdate) {
        var reqListErrors = containerUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new ContainerValidationException("Trying to update: error container request validation.", reqListErrors);
        var containerOpt = containerRepository.findById(containerId);
        containerOpt.orElseThrow(() -> new ContainerNotFoundException(containerId));
        ContainerEntity containerToUpdate = ContainerUpdateDto.toEntity(containerUpdate, containerOpt.get());
        var listErrors = containerToUpdate.validate();
        if (!listErrors.isEmpty())
            throw new ContainerValidationException("Trying to update: error container entity validation.", listErrors);
        try {
            return ContainerDto.toDto(containerRepository.save(containerToUpdate));
        } catch (Exception e) {
            log.error("Error trying to update container with ID: {}", containerToUpdate.getId(), e);
            throw new ContainersDatabaseException("Error trying to update container", e);
        }
    }

    @Override
    @Transactional
    public void delete(String containerId) {
        if (!containerRepository.existsById(containerId))
            throw new ContainerNotFoundException(containerId);
        try {
            containerRepository.deleteById(containerId);
            log.info("Container with ID: {} deleted successfully.", containerId);
        } catch (Exception e) {
            log.error("Error trying to delete container with ID: {}", containerId, e);
            throw new ContainersDatabaseException("Error trying to delete container", e);
        }
    }

    @Override
    public Optional<ContainerStatusSummaryDto> getStatusSummary(Long cityId) {
        log.info("Getting status summary for city ID: {}", cityId);
        Map<String, Long> statusSummaryMap = new HashMap<>();
        try {
            statusSummaryMap = containerRepository.getStatusSummary(cityId);   
        } catch (Exception e) {
            log.error("Error trying to get status summary for city ID: {}", cityId, e);
            throw new ContainersDatabaseException("Error trying to get status summary", e);
        }
        Integer light = statusSummaryMap.getOrDefault(WasteLevel.LIGHT.toString(), 0L).intValue();
        Integer medium = statusSummaryMap.getOrDefault(WasteLevel.MEDIUM.toString(), 0L).intValue();
        Integer heavy = statusSummaryMap.getOrDefault(WasteLevel.HEAVY.toString(), 0L).intValue();
        Integer total = statusSummaryMap.getOrDefault("total", 0L).intValue();
        var summary = ContainerStatusSummaryDto.builder()
                .light(light)
                .medium(medium)
                .heavy(heavy)
                .total(total)
                .build();
        return Optional.of(summary);
    }

    @Override
    public List<ContainerDto> findByCityAndLevelStatus(Long cityId, List<WasteLevel> wasteLevelStatuses) {
        log.info("Finding containers for city ID: {} with waste level statuses: {}", cityId, wasteLevelStatuses);
        try {
            List<String> statusStrings = wasteLevelStatuses.stream().map(WasteLevel::toString)
                    .collect(Collectors.toList());
            return containerRepository.findByCityAndLevelStatus(cityId, statusStrings).stream()
                    .map(ContainerDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find containers by city ID: {} and waste level statuses: {}", cityId, wasteLevelStatuses, e);
            throw new ContainersDatabaseException("Error trying to find containers", e);
        }
    }

    @Override
    @Transactional
    public ContainerDto addSensorData(ContainerAddSendorDto containerAddSendor) {
        var reqListErrors = containerAddSendor.validate();
        if (!reqListErrors.isEmpty())
            throw new ContainerValidationException("Trying to add sensor data: error request validation.", reqListErrors);
        log.info("Adding sensor data for container ID: {}", containerAddSendor.getId());
        var containerOpt = containerRepository.findById(containerAddSendor.getId());
        containerOpt.orElseThrow(() -> new ContainerNotFoundException(containerAddSendor.getId()));
        ContainerEntity existingContainer = containerOpt.get();
        existingContainer.setWasteLevelValue(containerAddSendor.getWasteLevelValue());
        existingContainer.setWasteLevelStatus(WasteLevelUtil.getWasteLevelFromDouble(containerAddSendor.getWasteLevelValue()));
        existingContainer.setTemperature(containerAddSendor.getTemperature());
        existingContainer.setUpdatedAt(Instant.now());
        var listErrors = existingContainer.validate();
        if (!listErrors.isEmpty())
            throw new ContainerValidationException("Trying to add sensor data: error entity validation.", listErrors);
        try {
            return ContainerDto.toDto(containerRepository.save(existingContainer));
        } catch (Exception e) {
            log.error("Error trying to add sensor data for container ID: {}", existingContainer.getId(), e);
            throw new ContainersDatabaseException("Error trying to add sensor data", e);
        }
    }

    @Override
    @Transactional
    public void updateMultipleZonesId(Long customerId, List<ContainerZoneUpdateDto> containerZoneUpdates) {
        for (ContainerZoneUpdateDto update : containerZoneUpdates) {
            var reqListErrors = update.validate();
            if (!reqListErrors.isEmpty())
                throw new ContainerValidationException("Error in container zone update validation.", reqListErrors);
        }
        try {
            for (ContainerZoneUpdateDto update : containerZoneUpdates) {
                containerRepository.updateZoneIdByContainerIdAndCustomerId(customerId, 
                    update.getContainerId(), update.getZoneId());
            }
        } catch (Exception e) {
            log.error("Error updating multiple zones for customer ID: {}", customerId, e);
            throw new ContainersDatabaseException("Error updating multiple zones", e);
        }
    }

}