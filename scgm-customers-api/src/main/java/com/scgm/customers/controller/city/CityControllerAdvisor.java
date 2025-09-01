package com.scgm.customers.controller.city;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scgm.customers.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.city.CityNotFoundException;
import com.scgm.customers.exceptions.city.CityValidationException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice("com.scgm.customers.controller")
@Slf4j
public class CityControllerAdvisor {

    @ExceptionHandler(CityNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleCityNotFoundException(CityNotFoundException ex) {
        log.debug("City not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(CityValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleCityValidationException(CityValidationException ex) {
        log.debug("City validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}