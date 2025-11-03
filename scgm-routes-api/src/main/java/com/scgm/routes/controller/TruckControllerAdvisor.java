package com.scgm.routes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scgm.routes.dto.DefaultResponseDto;
import com.scgm.routes.exceptions.TruckNotFoundException;
import com.scgm.routes.exceptions.TruckValidationException;
import com.scgm.routes.exceptions.TrucksDatabaseException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice("com.scgm.routes.controller")
@Slf4j
public class TruckControllerAdvisor {

    @ExceptionHandler(TruckNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleTruckNotFoundException(TruckNotFoundException ex) {
        log.info("Truck not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TruckValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleTruckValidationException(TruckValidationException ex) {
        log.info("Truck validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(TrucksDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleTrucksDatabaseException(TrucksDatabaseException ex) {
        log.error("Truck database error: {}", ex.getMessage(), ex);
        var response = new DefaultResponseDto("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}