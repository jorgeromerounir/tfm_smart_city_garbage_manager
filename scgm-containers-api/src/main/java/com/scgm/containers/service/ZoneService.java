package com.scgm.containers.service;

import java.util.List;
import java.util.Optional;

import com.scgm.containers.dto.ZoneAddDto;
import com.scgm.containers.dto.ZoneDto;
import com.scgm.containers.dto.ZoneUpdateDto;

public interface ZoneService {

    public Optional<ZoneDto> findById(String id);

    public ZoneDto add(ZoneAddDto zoneAdd);

    public List<ZoneDto> addMultiple(List<ZoneAddDto> zonesAdd);

    public List<ZoneDto> findByCustomerIdAndCityId(Long customerId, Long cityId);

    public ZoneDto update(String zoneId, ZoneUpdateDto zoneUpdate);

    public void delete(String zoneId);

}