package com.scgm.gateway.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class DefaultResponseDto {

    private List<String> messages;
    private Date date;
    private int status;

    public DefaultResponseDto(String message, int status) {
        this.date = new Date();
        this.messages = List.of(message);
        this.status = status;
    }

    public DefaultResponseDto(List<String> messages, int status) {
        this.messages = messages;
        this.date = new Date();
        this.status = status;
    }

}
