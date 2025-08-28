package com.scgm.customers.service.customer;

import java.util.List;
import java.util.Optional;

import com.scgm.customers.dto.customer.CustomerAddDto;
import com.scgm.customers.dto.customer.CustomerDto;
import com.scgm.customers.dto.customer.CustomerUpdateDto;

public interface CustomersService {

    public CustomerDto add(CustomerAddDto customerAdd);

    public Optional<CustomerDto> findById(Long id);

    public List<CustomerDto> findByNameContaining(String name);

    public List<CustomerDto> findByCityId(Long cityId);

    public List<CustomerDto> findAll();

    public CustomerDto update(Long customerId, CustomerUpdateDto customerUpdate);

}
