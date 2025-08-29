package com.scgm.customers.controller.user;

import com.scgm.customers.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.exceptions.user.UserNotFoundException;
import com.scgm.customers.exceptions.user.UserValidationException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.scgm.customers.controller")
@Slf4j
public class UserControllerAdvisor {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleUserNotFoundException(UserNotFoundException ex) {
        log.debug("User not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(UserValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleUserValidationException(UserValidationException ex) {
        log.debug("User validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}