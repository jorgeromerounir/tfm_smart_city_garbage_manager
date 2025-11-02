package com.scgm.routes.client.container;

import java.util.List;

import com.scgm.routes.dto.container.ContainerDto;

public interface ContainerClient {

    public List<ContainerDto> findByCityAndLevelStatus(Long cityId, List<String> wasteLevelStatuses);

    public List<ContainerDto> findByCustomerIdAndCityIdAndZoneId(Long customerId, Long cityId, 
        String zoneId, Integer limit);

}