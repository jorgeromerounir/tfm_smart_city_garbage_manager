package com.scgm.customers.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scgm.customers.dto.customer.CustomerAddDto;
import com.scgm.customers.dto.customer.CustomerDto;
import com.scgm.customers.dto.customer.CustomerUpdateDto;
import com.scgm.customers.service.customer.CustomersService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/customers")
@AllArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomersService customersService;

    @PostMapping
    public ResponseEntity<CustomerDto> add(@RequestBody CustomerAddDto customerAdd) {
        log.debug("Trying to add new customer");
        var customerDto = customersService.add(customerAdd);
        return new ResponseEntity<>(customerDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> findById(@PathVariable Long id) {
        log.debug("Finding customer with ID: {}", id);
        var customerOpt = customersService.findById(id);
        return customerOpt.map(customer -> new ResponseEntity<>(customer, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<CustomerDto>> findByNameContaining(@RequestParam String name) {
        log.debug("Finding customers with name containing: {}", name);
        List<CustomerDto> customers = customersService.findByNameContaining(name);
        if (customers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/by-city/{cityId}")
    public ResponseEntity<List<CustomerDto>> findByCityId(@PathVariable Long cityId) {
        log.debug("Finding customers for city with ID: {}", cityId);
        List<CustomerDto> customers = customersService.findByCityId(cityId);
        if (customers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDto>> findAll() {
        log.debug("Finding all customers");
        List<CustomerDto> customers = customersService.findAll();
        if (customers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<CustomerDto> update(@PathVariable Long customerId, 
        @RequestBody CustomerUpdateDto customerUpdate) {
        log.debug("Trying to update customer with ID: {}", customerId);
        var customerDto = customersService.update(customerId, customerUpdate);
        return new ResponseEntity<>(customerDto, HttpStatus.OK);
    }

}
