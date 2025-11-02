package com.scgm.containers.dto;

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
public class ContainerZoneUpdateDto {
    
    private String containerId;
    private String zoneId;
    
    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (containerId == null || containerId.trim().isEmpty())
            listErrors.add("containerId: cannot be empty");
        return listErrors;
    }
}