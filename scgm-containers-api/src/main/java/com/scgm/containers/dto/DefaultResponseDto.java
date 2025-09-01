package com.scgm.containers.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DefaultResponseDto {

    private List<String> messages;
    private LocalDateTime date;
    private int status;

    public DefaultResponseDto(String message, int status) {
        this.date = LocalDateTime.now();
        this.messages = List.of(message);
        this.status = status;
    }

    public DefaultResponseDto(List<String> messages, int status) {
        this.messages = messages;
        this.date = LocalDateTime.now();
        this.status = status;
    }

}
