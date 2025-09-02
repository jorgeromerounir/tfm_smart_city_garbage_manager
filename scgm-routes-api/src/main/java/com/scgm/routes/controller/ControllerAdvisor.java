package com.scgm.routes.controller;

import com.scgm.routes.dto.DefaultResponseDto;
import com.scgm.routes.exceptions.RouteLogicException;
import com.scgm.routes.exceptions.RoutesDatabaseException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice("com.scgm.routes.controller")
@Slf4j
public class ControllerAdvisor {

    @ExceptionHandler(RoutesDatabaseException.class)
    public ResponseEntity<DefaultResponseDto> handleRoutesDatabaseException(RoutesDatabaseException ex) {
        log.error("Error from database: ", ex);
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RouteLogicException.class)
    public ResponseEntity<DefaultResponseDto> handleCustomerBusinessException(RouteLogicException ex) {
        log.warn("Routes business error: {}", ex.getMessage());
        var response = new DefaultResponseDto(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
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
