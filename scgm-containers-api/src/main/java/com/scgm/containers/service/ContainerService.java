package com.scgm.containers.service;

import java.util.List;
import java.util.Optional;

import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerUpdateDto;

public interface ContainerService {

    public ContainerDto add(ContainerAddDto containerAdd);

    public Optional<ContainerDto> findById(String id);

    public List<ContainerDto> findByAddressContaining(String address);

    public List<ContainerDto> findByCityId(Long cityId);

    public List<ContainerDto> findByCustomerId(Long customerId);

    public ContainerDto update(String containerId, ContainerUpdateDto containerUpdate);

    public void delete(String containerId);

}