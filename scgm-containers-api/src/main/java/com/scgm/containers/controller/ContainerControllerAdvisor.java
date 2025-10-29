package com.scgm.containers.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scgm.containers.dto.DefaultResponseDto;
import com.scgm.containers.exceptions.ContainerNotFoundException;
import com.scgm.containers.exceptions.ContainerValidationException;
import com.scgm.containers.exceptions.ContainersDatabaseException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice("com.scgm.containers.controller")
@Slf4j
public class ContainerControllerAdvisor {

    @ExceptionHandler(ContainerNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleContainerNotFoundException(ContainerNotFoundException ex) {
        log.info("Container not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ContainerValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleContainerValidationException(ContainerValidationException ex) {
        log.info("Container validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}