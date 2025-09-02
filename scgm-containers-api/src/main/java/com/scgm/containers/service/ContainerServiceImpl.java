package com.scgm.containers.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerStatusSummaryDto;
import com.scgm.containers.dto.ContainerUpdateDto;
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
    @Transactional
    public ContainerDto update(String containerId, ContainerUpdateDto containerUpdate) {
        var reqListErrors = containerUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new ContainerValidationException("Trying to update: error container request validation.", reqListErrors);
        var containerOpt = containerRepository.findById(containerId);
        containerOpt.orElseThrow(() -> new ContainerNotFoundException(containerId));
        ContainerEntity existingContainer = containerOpt.get();
        existingContainer.setLatitude(containerUpdate.getLatitude());
        existingContainer.setLongitude(containerUpdate.getLongitude());
        existingContainer.setWasteLevelValue(containerUpdate.getWasteLevelValue());
        existingContainer.setWasteLevelStatus(WasteLevelUtil.getWasteLevelFromDouble(containerUpdate.getWasteLevelValue()));
        existingContainer.setTemperature(containerUpdate.getTemperature());
        existingContainer.setAddress(containerUpdate.getAddress());
        existingContainer.setCityId(containerUpdate.getCityId());
        existingContainer.setCustomerId(containerUpdate.getCustomerId());
        existingContainer.setUpdatedAt(Instant.now());
        var listErrors = existingContainer.validate();
        if (!listErrors.isEmpty())
            throw new ContainerValidationException("Trying to update: error container entity validation.", listErrors);
        try {
            return ContainerDto.toDto(containerRepository.save(existingContainer));
        } catch (Exception e) {
            log.error("Error trying to update container with ID: {}", existingContainer.getId(), e);
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
            log.debug("Container with ID: {} deleted successfully.", containerId);
        } catch (Exception e) {
            log.error("Error trying to delete container with ID: {}", containerId, e);
            throw new ContainersDatabaseException("Error trying to delete container", e);
        }
    }

    @Override
    public Optional<ContainerStatusSummaryDto> getStatusSummary(Long cityId) {
        log.debug("Getting status summary for city ID: {}", cityId);
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

}