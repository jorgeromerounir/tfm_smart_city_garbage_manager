package com.scgm.routes.service;

import java.util.List;
import java.util.Optional;

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.dto.TruckDto;
import com.scgm.routes.dto.TruckUpdateDto;

public interface TruckService {

    TruckDto add(TruckAddDto truckAdd);
    
    Optional<TruckDto> findById(String id);
    
    List<TruckDto> findByCustomerCityAndAvailable(Long customerId, Long cityId, Boolean available);

    List<TruckDto> findByCustomerCity(Long customerId, Long cityId, String nameCoincidence, Integer limit);

    TruckDto update(String truckId, TruckUpdateDto truckUpdate);

    void delete(String truckId);

}