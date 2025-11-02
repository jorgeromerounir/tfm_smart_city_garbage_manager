package com.scgm.containers.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scgm.containers.dto.DefaultResponseDto;
import com.scgm.containers.exceptions.ZoneNotFoundException;
import com.scgm.containers.exceptions.ZoneValidationException;
import com.scgm.containers.exceptions.ZonesDatabaseException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice("com.scgm.containers.controller")
@Slf4j
public class ZoneControllerAdvisor {

    @ExceptionHandler(ZoneNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleZoneNotFoundException(ZoneNotFoundException ex) {
        log.info("Zone not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ZoneValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleZoneValidationException(ZoneValidationException ex) {
        log.info("Zone validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ZonesDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleZonesDatabaseException(ZonesDatabaseException ex) {
        log.error("Zone database error: {}", ex.getMessage(), ex);
        var response = new DefaultResponseDto("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}