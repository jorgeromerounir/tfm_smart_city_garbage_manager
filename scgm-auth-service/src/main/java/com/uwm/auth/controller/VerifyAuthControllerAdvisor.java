package com.uwm.auth.controller;

import com.uwm.auth.dto.DefaultResponseDto;
import com.scgm.customers.exceptions.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.uwm.auth.controller")
@Slf4j
public class VerifyAuthControllerAdvisor {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<DefaultResponseDto> handleUnauthorizedException(UnauthorizedException ex) {
        log.debug("Unauthorized access: error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}