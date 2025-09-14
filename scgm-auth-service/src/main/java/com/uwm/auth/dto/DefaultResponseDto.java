package com.uwm.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
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