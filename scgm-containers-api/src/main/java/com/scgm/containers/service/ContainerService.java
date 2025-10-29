package com.scgm.containers.service;

import java.util.List;
import java.util.Optional;

import com.scgm.containers.dto.BoundsDto;
import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerUpdateDto;
import com.scgm.containers.dto.ContainerAddSendorDto;
import com.scgm.containers.dto.ContainerStatusSummaryDto;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;

public interface ContainerService {

    public ContainerDto add(ContainerAddDto containerAdd);

    public Optional<ContainerDto> findById(String id);

    public List<ContainerDto> findByAddressContaining(String address);

    public List<ContainerDto> findByCityId(Long cityId);

    public List<ContainerDto> findByCityAndLevelStatus(Long cityId, List<WasteLevel> wasteLevelStatuses);

    public List<ContainerDto> findByCustomerId(Long customerId);

    public List<ContainerDto> findByCustomerIdAndCityId(Long customerId, Long cityId);

    public List<ContainerDto> findByCustomerIdAndCityIdAndBounds(Long customerId, Long cityId, BoundsDto bounds);

    public ContainerDto update(String containerId, ContainerUpdateDto containerUpdate);

    public void delete(String containerId);

    public Optional<ContainerStatusSummaryDto> getStatusSummary(Long cityId);

    public ContainerDto addSensorData(ContainerAddSendorDto containerAddSendor);

}