package com.scgm.customers.service.customer;

import java.util.List;
import java.util.Optional;

import com.scgm.customers.dto.customer.CustomerAddReq;
import com.scgm.customers.dto.customer.CustomerDto;

public interface CustomersService {

    public Optional<CustomerDto> add(CustomerAddReq customerAddReq);

    public Optional<CustomerDto> findById(Long id);

    public List<CustomerDto> findByNameContaining(String name);

    public List<CustomerDto> findByCityId(Long cityId);

}
