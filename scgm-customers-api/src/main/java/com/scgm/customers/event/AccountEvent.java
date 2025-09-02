package com.scgm.customers.event;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountEvent {
    
    private String eventType;
    private Long accountId;
    private String email;
    private String profile;
    private String password;
    private Map<String, String> claims;
    
}
