package com.scgm.customers.controller;

import com.scgm.customers.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.CustomerAlreadyExistsException;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomerNotFoundException;
import com.scgm.customers.exceptions.CustomerValidationException;
import com.scgm.customers.exceptions.CustomersLogicException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.scgm.customers.controller")
@Slf4j
public class CustomerControllerAdvisor {

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerNotFoundException(CustomerNotFoundException ex) {
        log.debug("Customer not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(CustomerAlreadyExistsException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerAlreadyExistsException(CustomerAlreadyExistsException ex) {
        log.debug("Customer already exists: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

}
