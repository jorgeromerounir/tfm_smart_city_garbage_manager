package com.scgm.customers.controller;

import com.scgm.customers.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.CustomerNotFoundException;
import com.scgm.customers.exceptions.CustomerValidationException;

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

    @ExceptionHandler(CustomerValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerValidationException(CustomerValidationException ex) {
        log.debug("Customer validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
