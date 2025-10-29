package com.scgm.routes.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.dto.TruckDto;
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
    public List<TruckDto> findByCustomerCityAndAvailable(Long customerId, Long cityId, Boolean available) {
        log.info("Finding trucks for customerId: {}, cityId: {}, available: {}", customerId, cityId, available);
        try {
            return truckRepository.findByCustomerIdAndCityIdAndAvailable(customerId, cityId, available)
                    .stream()
                    .map(TruckDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error finding trucks for customerId: {}, cityId: {}, available: {}", customerId, cityId, available, e);
            throw new RuntimeException("Error finding trucks", e);
        }
    }
}