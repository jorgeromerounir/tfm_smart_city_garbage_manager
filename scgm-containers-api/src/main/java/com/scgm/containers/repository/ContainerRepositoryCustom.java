package com.scgm.containers.repository;

import java.util.List;

import com.scgm.containers.dto.ContainerSearchParamsDto;
import com.scgm.containers.entity.ContainerEntity;

public interface ContainerRepositoryCustom {
    
    List<ContainerEntity> findByCustomerIdAndCityIdPaginatedDynamic(
        Long customerId, Long cityId, ContainerSearchParamsDto searchParams);
}