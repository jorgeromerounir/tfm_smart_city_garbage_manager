package com.scgm.customers.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.customers.dto.CustomerAddDto;
import com.scgm.customers.dto.CustomerDto;
import com.scgm.customers.dto.CustomerUpdateDto;
import com.scgm.customers.entity.CustomerEntity;
import com.scgm.customers.entity.customer.CityEntity;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomerNotFoundException;
import com.scgm.customers.exceptions.CustomerValidationException;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.repository.CustomerRepository;
import com.scgm.customers.repository.city.CityRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class CustomersServiceImpl implements CustomersService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;

    @Override
    public CustomerDto add(CustomerAddDto customerAdd) {
        var reqListErrors = customerAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new CustomerValidationException("Trying to add: error customer request validation.", reqListErrors);
        Optional<CityEntity> cityOptional = cityRepository.findById(customerAdd.getCityId());
        if (cityOptional.isEmpty()) {
            var msg = String.format("The city: %s doesn't exists.", customerAdd.getCityId());
            throw new CustomersLogicException(msg);
        }
        var customerEntity = CustomerAddDto.toEntity(customerAdd);
        customerEntity.setCity(cityOptional.get());
        var listErrors = customerEntity.validate();
        if (!listErrors.isEmpty())
            throw new CustomerValidationException("Trying to add: error customer entity validation.", listErrors);
        try {
            return CustomerDto.toDto(customerRepository.save(customerEntity));
        } catch (Exception e) {
            log.error("Error trying to add customer with name: {}", customerEntity.getName(), e);
            throw new CustomerDatabaseException("Error trying to add customer", e);
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

    @Override
    @Transactional
    public CustomerDto update(Long customerId, CustomerUpdateDto customerReq) {
        var reqListErrors = customerReq.validate();
        if (!reqListErrors.isEmpty())
            throw new CustomerValidationException("Trying to update: error customer request validation.", reqListErrors);
        var customerOpt = customerRepository.findById(customerId);
        customerOpt.orElseThrow(() -> new CustomerNotFoundException(customerId));
        Optional<CityEntity> cityOpt = cityRepository.findById(customerReq.getCityId());
        if (cityOpt.isEmpty()) {
            var msg = String.format("The city: %s doesn't exists,", customerReq.getCityId());
            throw new CustomersLogicException(msg);
        }
        CustomerEntity existingCustomer = customerOpt.get();
        existingCustomer.setName(customerReq.getName());
        existingCustomer.setDescription(customerReq.getDescription());
        existingCustomer.setActive(customerReq.getActive());
        existingCustomer.setUpdatedAt(Instant.now());
        existingCustomer.setCity(cityOpt.get());
        var listErrors = existingCustomer.validate();
        if (!listErrors.isEmpty())
            throw new CustomerValidationException("Trying to update: error customer entity validation.", listErrors);
        try {
            return CustomerDto.toDto(customerRepository.save(existingCustomer));
        } catch (Exception e) {
            log.error("Error trying to update customer with ID: {}", existingCustomer.getId(), e);
            throw new CustomerDatabaseException("Error trying to update customer", e);
        }
    }

    @Override
    @Transactional
    public void delete(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new CustomerNotFoundException(customerId);
        }
        try {
            customerRepository.deleteById(customerId);
            log.debug("Customer with ID: {} deleted successfully.", customerId);
        } catch (Exception e) {
            log.error("Error trying to delete customer with ID: {}", customerId, e);
            throw new CustomerDatabaseException("Error trying to delete customer", e);
        }
    }

}