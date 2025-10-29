package com.scgm.routes.service;

import java.util.List;

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.dto.TruckDto;

public interface TruckService {

    TruckDto add(TruckAddDto truckAdd);
    
    List<TruckDto> findByCustomerCityAndAvailable(Long customerId, Long cityId, Boolean available);

}