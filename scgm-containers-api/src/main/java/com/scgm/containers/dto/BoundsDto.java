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
public class BoundsDto {

    private Double startLat;
    private Double endLat;
    private Double startLng;
    private Double endLng;
    private Integer limit;

    public List<String> validate() {
        List<String> errors = new ArrayList<>();
        
        if (startLat == null) {
            errors.add("startLat is required");
        }
        if (endLat == null) {
            errors.add("endLat is required");
        }
        if (startLng == null) {
            errors.add("startLng is required");
        }
        if (endLng == null) {
            errors.add("endLng is required");
        }
        if (limit == null || limit < 0) {
            errors.add("limit must be greater than or equal to 0");
        }
        
        return errors;
    }
}