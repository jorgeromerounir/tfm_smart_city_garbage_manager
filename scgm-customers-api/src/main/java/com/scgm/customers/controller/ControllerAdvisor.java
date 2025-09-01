package com.scgm.customers.controller;

import com.scgm.customers.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomerValidationException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.scgm.customers.controller")
@Slf4j
public class ControllerAdvisor {

    @ExceptionHandler(CustomerDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerDatabaseException(CustomerDatabaseException ex) {
        log.error("Error from database: ", ex);
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CustomersLogicException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerBusinessException(CustomersLogicException ex) {
        log.warn("Customer business error: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CustomerValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerValidationException(CustomerValidationException ex) {
        log.debug("Customer validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<DefaultResponseDto> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred", ex);
        var response = new DefaultResponseDto("An unexpected error occurred",
                HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
