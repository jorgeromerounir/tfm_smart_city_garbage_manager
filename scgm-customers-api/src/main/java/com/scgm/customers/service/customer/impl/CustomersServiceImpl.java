package com.scgm.customers.service.customer.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.scgm.customers.dto.customer.CustomerAddReq;
import com.scgm.customers.dto.customer.CustomerDto;
import com.scgm.customers.entity.customer.CityEntity;
import com.scgm.customers.entity.customer.CustomerEntity;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomerValidationException;
import com.scgm.customers.exceptions.CustomersException;
import com.scgm.customers.repository.customer.CityRepository;
import com.scgm.customers.repository.customer.CustomerRepository;
import com.scgm.customers.service.customer.CustomersService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class CustomersServiceImpl implements CustomersService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;

    @Override
    public CustomerDto add(CustomerAddReq customerAddReq) {
        Optional<CityEntity> cityOptional = cityRepository.findById(customerAddReq.getCityId());
        if (cityOptional.isEmpty()) {
            var message = String.format("The city: %s doesn't exists", customerAddReq.getCityId());
            throw new CustomerValidationException(message);
        }
        var customerEntity = CustomerAddReq.toEntity(customerAddReq);
        customerEntity.setCity(cityOptional.get());
        var listErrors = customerEntity.validate();
        if (!listErrors.isEmpty()) {
            throw new CustomerValidationException("Trying to add: error customer entity validation", listErrors);
        }
        try {
            CustomerEntity savedCustomer = customerRepository.save(customerEntity);
            return CustomerDto.toDto(savedCustomer);
        } catch (Exception e) {
            log.error("Error trying to save customer with name: {}", customerEntity.getName(), e);
            throw new CustomerDatabaseException("Error trying to save customer", e);
        }
    }

    @Override
    public Optional<CustomerDto> findById(Long id) {
        return customerRepository.findById(id)
                .map(CustomerDto::toDto);
    }

    @Override
    public List<CustomerDto> findByNameContaining(String name) {
        List<CustomerEntity> customers = customerRepository.findByNameContaining(name);
        return customers.stream()
                .map(CustomerDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDto> findByCityId(Long cityId) {
        return customerRepository.findByCityId(cityId).stream()
                .map(CustomerDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDto> findAll() {
        return customerRepository.findAll().stream()
                .map(CustomerDto::toDto)
                .collect(Collectors.toList());
    }

}