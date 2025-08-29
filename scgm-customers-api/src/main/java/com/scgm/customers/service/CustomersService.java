package com.scgm.customers.service;

import java.util.List;
import java.util.Optional;

import com.scgm.customers.dto.CustomerAddDto;
import com.scgm.customers.dto.CustomerDto;
import com.scgm.customers.dto.CustomerUpdateDto;

public interface CustomersService {

    public CustomerDto add(CustomerAddDto customerAdd);

    public Optional<CustomerDto> findById(Long id);

    public List<CustomerDto> findByNameContaining(String name);

    public List<CustomerDto> findByCityId(Long cityId);

    public List<CustomerDto> findAll();

    public CustomerDto update(Long customerId, CustomerUpdateDto customerUpdate);

    public void delete(Long customerId);

}
