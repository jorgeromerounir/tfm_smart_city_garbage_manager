package com.uwm.auth.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthEndpointDto {

    private String url;
    private String method;
    private String accessToken;
    private String userId;
    private String customerId;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (url == null || url.trim().isEmpty())
            listErrors.add("url: cannot be empty");
        if (method == null || method.trim().isEmpty())
            listErrors.add("method: cannot be empty");
        return listErrors;
    }

}