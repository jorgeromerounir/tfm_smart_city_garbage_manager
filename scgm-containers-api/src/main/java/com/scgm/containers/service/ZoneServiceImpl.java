package com.scgm.containers.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.containers.dto.ZoneAddDto;
import com.scgm.containers.dto.ZoneDto;
import com.scgm.containers.dto.ZoneUpdateDto;
import com.scgm.containers.entity.ZoneEntity;
import com.scgm.containers.exceptions.ZoneNotFoundException;
import com.scgm.containers.exceptions.ZoneValidationException;
import com.scgm.containers.exceptions.ZonesDatabaseException;
import com.scgm.containers.repository.ZoneRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class ZoneServiceImpl implements ZoneService {

    private final ZoneRepository zoneRepository;

    @Override
    public Optional<ZoneDto> findById(String id) {
        try {
            return zoneRepository.findById(id).map(ZoneDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find zone with ID: {}", id, e);
            throw new ZonesDatabaseException("Error trying to find zone", e);
        }
    }

    @Override
    public ZoneDto add(ZoneAddDto zoneAdd) {
        var reqListErrors = zoneAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new ZoneValidationException("Trying to add: error zone request validation.", reqListErrors);
        var zoneEntity = ZoneAddDto.toEntity(zoneAdd);
        var listErrors = zoneEntity.validate();
        if (!listErrors.isEmpty())
            throw new ZoneValidationException("Trying to add: error zone entity validation.", listErrors);
        try {
            return ZoneDto.toDto(zoneRepository.save(zoneEntity));
        } catch (Exception e) {
            log.error("Error trying to add zone with id: {}", zoneEntity.getId(), e);
            throw new ZonesDatabaseException("Error trying to add zone", e);
        }
    }

    @Override
    @Transactional
    public List<ZoneDto> addMultiple(List<ZoneAddDto> zonesAdd) {
        List<String> allErrors = new ArrayList<>();
        // Validate all zones first
        for (int i = 0; i < zonesAdd.size(); i++) {
            final int zoneIndex = i + 1;
            var errors = zonesAdd.get(i).validate();
            if (!errors.isEmpty()) {
                errors.forEach(error -> allErrors.add("Zone " + zoneIndex + ": " + error));
            }
        }
        if (!allErrors.isEmpty()) {
            throw new ZoneValidationException("Multiple zones validation failed", allErrors);
        }
        // Convert and validate entities
        List<ZoneEntity> zoneEntities = new ArrayList<>();
        for (int i = 0; i < zonesAdd.size(); i++) {
            final int zoneIndex = i + 1;
            var zoneEntity = ZoneAddDto.toEntity(zonesAdd.get(i));
            var entityErrors = zoneEntity.validate();
            if (!entityErrors.isEmpty()) {
                entityErrors.forEach(error -> allErrors.add("Zone " + zoneIndex + " entity: " + error));
            }
            zoneEntities.add(zoneEntity);
        }
        if (!allErrors.isEmpty()) {
            throw new ZoneValidationException("Multiple zones entity validation failed", allErrors);
        }
        try {
            List<ZoneEntity> savedZones = zoneRepository.saveAll(zoneEntities);
            return savedZones.stream().map(ZoneDto::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to add multiple zones", e);
            throw new ZonesDatabaseException("Error trying to add multiple zones", e);
        }
    }

    @Override
    public List<ZoneDto> findByCustomerIdAndCityId(Long customerId, Long cityId) {
        try {
            return zoneRepository.findByCustomerIdAndCityId(customerId, cityId).stream().map(ZoneDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find zones by customer ID: {} and city ID: {}", customerId, cityId, e);
            throw new ZonesDatabaseException("Error trying to find zones", e);
        }
    }

    @Override
    @Transactional
    public ZoneDto update(String zoneId, ZoneUpdateDto zoneUpdate) {
        var reqListErrors = zoneUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new ZoneValidationException("Trying to update: error zone request validation.", reqListErrors);
        var zoneOpt = zoneRepository.findById(zoneId);
        zoneOpt.orElseThrow(() -> new ZoneNotFoundException(zoneId));
        ZoneEntity zoneToUpdate = ZoneUpdateDto.toEntity(zoneUpdate, zoneOpt.get());
        var listErrors = zoneToUpdate.validate();
        if (!listErrors.isEmpty())
            throw new ZoneValidationException("Trying to update: error zone entity validation.", listErrors);
        try {
            return ZoneDto.toDto(zoneRepository.save(zoneToUpdate));
        } catch (Exception e) {
            log.error("Error trying to update zone with ID: {}", zoneToUpdate.getId(), e);
            throw new ZonesDatabaseException("Error trying to update zone", e);
        }
    }

    @Override
    @Transactional
    public void delete(String zoneId) {
        if (!zoneRepository.existsById(zoneId))
            throw new ZoneNotFoundException(zoneId);
        try {
            zoneRepository.deleteById(zoneId);
            log.info("Zone with ID: {} deleted successfully.", zoneId);
        } catch (Exception e) {
            log.error("Error trying to delete zone with ID: {}", zoneId, e);
            throw new ZonesDatabaseException("Error trying to delete zone", e);
        }
    }

}