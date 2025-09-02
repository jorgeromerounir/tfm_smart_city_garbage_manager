package com.scgm.routes.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DefaultResponseDto {

    private Object message;
    private int status;

    public DefaultResponseDto(String message, int status) {
        this.message = message;
        this.status = status;
    }

    public DefaultResponseDto(List<String> errors, int status) {
        this.message = errors;
        this.status = status;
    }

}