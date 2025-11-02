package com.scgm.routes.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.scgm.routes.entity.WasteLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizeRouteDto {

    public static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private Long cityId;
    private String zoneId;
    private Double startLat;
    private Double startLng;
    private List<WasteLevel> wasteTypes;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (zoneId == null || zoneId.trim().isEmpty()) {
            listErrors.add("zoneId: is required");
        } else if (!UUID_PATTERN.matcher(zoneId).matches()) {
            listErrors.add("zoneId: invalid UUID format");
        }
        if (startLat == null)
            listErrors.add("startLat: is required");
        else if (startLat < -90.0 || startLat > 90.0)
            listErrors.add("startLat: must be between -90 and 90");
        if (startLng == null)
            listErrors.add("startLng: is required");
        else if (startLng < -180.0 || startLng > 180.0)
            listErrors.add("startLng: must be between -180 and 180");
        return listErrors;
    }

}