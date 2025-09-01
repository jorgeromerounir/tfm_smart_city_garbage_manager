package com.scgm.containers.controller;

import com.scgm.containers.dto.DefaultResponseDto;
import com.scgm.containers.exceptions.ContainersLogicException;
import com.scgm.containers.exceptions.ContainersDatabaseException;
import com.scgm.containers.exceptions.ContainerValidationException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.scgm.containers.controller")
@Slf4j
public class ControllerAdvisor {

    @ExceptionHandler(ContainersDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleContainersDatabaseException(ContainersDatabaseException ex) {
        log.error("Error from database: ", ex);
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ContainersLogicException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerBusinessException(ContainersLogicException ex) {
        log.warn("Container business error: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ContainerValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleContainerValidationException(ContainerValidationException ex) {
        log.debug("Container validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
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
