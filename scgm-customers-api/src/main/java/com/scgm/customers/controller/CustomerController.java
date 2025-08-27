package com.scgm.customers.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scgm.customers.dto.customer.CustomerAddReq;
import com.scgm.customers.dto.customer.CustomerDto;
import com.scgm.customers.service.customer.CustomersService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@AllArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomersService customersService;

    @PostMapping
    public ResponseEntity<CustomerDto> add(@RequestBody CustomerAddReq customerAddReq) {
        log.debug("Trying to add new customer");
        var customerDto = customersService.add(customerAddReq);
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
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/by-city/{cityId}")
    public ResponseEntity<List<CustomerDto>> findByCityId(@PathVariable Long cityId) {
        log.debug("Finding customers for city with ID: {}", cityId);
        List<CustomerDto> customers = customersService.findByCityId(cityId);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDto>> findAll() {
        log.debug("Finding all customers");
        List<CustomerDto> customers = customersService.findAll();
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

}
