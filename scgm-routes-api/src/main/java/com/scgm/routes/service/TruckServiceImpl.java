package com.scgm.routes.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.dto.TruckDto;
import com.scgm.routes.dto.TruckUpdateDto;
import com.scgm.routes.exceptions.TruckNotFoundException;
import com.scgm.routes.exceptions.TruckValidationException;
import com.scgm.routes.exceptions.TrucksDatabaseException;
import com.scgm.routes.repository.TruckRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class TruckServiceImpl implements TruckService {

    private final TruckRepository truckRepository;

    @Override
    public TruckDto add(TruckAddDto truckAdd) {
        var reqListErrors = truckAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new TruckValidationException("Trying to add: error truck request validation.", reqListErrors);
        var truckEntity = TruckAddDto.toEntity(truckAdd);
        var listErrors = truckEntity.validate();
        if (!listErrors.isEmpty())
            throw new TruckValidationException("Trying to add: error truck entity validation.", listErrors);
        try {
            return TruckDto.toDto(truckRepository.save(truckEntity));
        } catch (Exception e) {
            log.error("Error trying to add truck with id: {}", truckEntity.getId(), e);
            throw new TrucksDatabaseException("Error trying to add truck", e);
        }
    }

    @Override
    public Optional<TruckDto> findById(String id) {
        try {
            return truckRepository.findById(id).map(TruckDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find truck with ID: {}", id, e);
            throw new TrucksDatabaseException("Error trying to find truck", e);
        }
    }

    @Override
    public List<TruckDto> findByCustomerCityAndAvailable(Long customerId, Long cityId, Boolean available) {
        log.info("Finding trucks for customerId: {}, cityId: {}, available: {}", customerId, cityId, available);
        try {
            return truckRepository.findByCustomerIdAndCityIdAndAvailable(customerId, cityId, available)
                    .stream()
                    .map(TruckDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error finding trucks for customerId: {}, cityId: {}, available: {}", customerId, cityId, available, e);
            throw new TrucksDatabaseException("Error finding trucks", e);
        }
    }

    @Override
    public List<TruckDto> findByCustomerCity(Long customerId, Long cityId, String nameCoincidence, Integer limit) {
        try {
            if (limit == null || limit < 0)
                limit = 500;
            if (limit > 2000)
                limit = 2000;
            
            Pageable pageable = PageRequest.of(0, limit, Sort.by("name").ascending());
            
            if (StringUtils.isEmpty(nameCoincidence)) {
                return truckRepository.findByCustomerIdAndCityId(customerId, cityId, pageable)
                    .stream().map(TruckDto::toDto)
                    .collect(Collectors.toList());
            } else {
                return truckRepository.findByCustomerIdAndCityIdWithNameContaining(customerId, cityId, nameCoincidence, pageable)
                    .stream().map(TruckDto::toDto)
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error trying to find trucks by customer ID: {} and city ID: {}", customerId, cityId, e);
            throw new TrucksDatabaseException("Error trying to find trucks", e);
        }
    }

    @Override
    @Transactional
    public TruckDto update(String truckId, TruckUpdateDto truckUpdate) {
        var reqListErrors = truckUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new TruckValidationException("Trying to update: error truck request validation.", reqListErrors);
        var truckOpt = truckRepository.findById(truckId);
        truckOpt.orElseThrow(() -> new TruckNotFoundException(truckId));
        var truckToUpdate = TruckUpdateDto.toEntity(truckUpdate, truckOpt.get());
        var listErrors = truckToUpdate.validate();
        if (!listErrors.isEmpty())
            throw new TruckValidationException("Trying to update: error truck entity validation.", listErrors);
        try {
            return TruckDto.toDto(truckRepository.save(truckToUpdate));
        } catch (Exception e) {
            log.error("Error trying to update truck with ID: {}", truckToUpdate.getId(), e);
            throw new TrucksDatabaseException("Error trying to update truck", e);
        }
    }

    @Override
    @Transactional
    public void delete(String truckId) {
        if (!truckRepository.existsById(truckId))
            throw new TruckNotFoundException(truckId);
        try {
            truckRepository.deleteById(truckId);
            log.info("Truck with ID: {} deleted successfully.", truckId);
        } catch (Exception e) {
            log.error("Error trying to delete truck with ID: {}", truckId, e);
            throw new TrucksDatabaseException("Error trying to delete truck", e);
        }
    }
}