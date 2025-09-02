package com.scgm.routes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scgm.routes.dto.DefaultResponseDto;
import com.scgm.routes.exceptions.RouteLogicException;
import com.scgm.routes.exceptions.RouteNotFoundException;
import com.scgm.routes.exceptions.RoutesDatabaseException;
import com.scgm.routes.exceptions.RouteValidationException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice("com.scgm.routes.controller")
@Slf4j
public class RouteControllerAdvisor {

    @ExceptionHandler(RouteNotFoundException.class)
    public ResponseEntity<DefaultResponseDto> handleRouteNotFoundException(RouteNotFoundException ex) {
        log.debug("Route not found: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(RouteValidationException.class)
    public ResponseEntity<DefaultResponseDto> handleRouteValidationException(RouteValidationException ex) {
        log.debug("Route validation error: {}, error list: {}", ex.getMessage(), ex.getErrors());
        var response = new DefaultResponseDto(ex.getErrors(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RouteLogicException.class)
    public ResponseEntity<DefaultResponseDto> handleRouteLogicException(RouteLogicException ex) {
        log.warn("Route business logic error: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RoutesDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleRoutesDatabaseException(RoutesDatabaseException ex) {
        log.error("Database error: {}", ex.getMessage(), ex);
        var response = new DefaultResponseDto("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}