package com.scgm.containers.service;

import java.util.List;
import java.util.Optional;

import com.scgm.containers.dto.BoundsDto;
import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerSearchParamsDto;
import com.scgm.containers.dto.ContainerUpdateDto;
import com.scgm.containers.dto.ContainerAddSendorDto;
import com.scgm.containers.dto.ContainerStatusSummaryDto;
import com.scgm.containers.dto.ContainerZoneUpdateDto;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;

public interface ContainerService {

    public ContainerDto add(ContainerAddDto containerAdd);

    public Optional<ContainerDto> findById(String id);

    public List<ContainerDto> findByAddressContaining(String address);

    public List<ContainerDto> findByCityId(Long cityId);

    public List<ContainerDto> findByCityAndLevelStatus(Long cityId, List<WasteLevel> wasteLevelStatuses);

    public List<ContainerDto> findByCustomerId(Long customerId);

    public List<ContainerDto> findByCustomerIdAndCityId(Long customerId, Long cityId, Integer limit, Boolean hasZoneId);

    public List<ContainerDto> findByCustomerIdAndCityIdPaginated(Long customerId, Long cityId, ContainerSearchParamsDto searchParams);

    public List<ContainerDto> findByCustomerIdAndCityIdAndZoneId(Long customerId, Long cityId, String zoneId, Integer limit);

    public ContainerDto update(String containerId, ContainerUpdateDto containerUpdate);

    public void delete(String containerId);

    public Optional<ContainerStatusSummaryDto> getStatusSummary(Long cityId);

    public ContainerDto addSensorData(ContainerAddSendorDto containerAddSendor);

    public void updateMultipleZonesId(Long customerId, List<ContainerZoneUpdateDto> containerZoneUpdates);

}