package com.scgm.containers.dto;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.scgm.containers.entity.ContainerEntity;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerSearchParamsDto {

    private String addressCoincidence;
    private String zoneId;
    private Integer limit;
    private WasteLevel wasteLevelStatus;
    private Double betweenLatitude;
    private Double betweenLongitude;

    public List<String> validate() {
        List<String> errors = new ArrayList<>();
        if (addressCoincidence != null && addressCoincidence.length() > 300) {
            errors.add("addressCoincidence must not exceed 300 characters");
        }
        if (addressCoincidence != null && !StringUtils.isEmpty(addressCoincidence) && 
            !ContainerEntity.INJECTION_PATTERN.matcher(addressCoincidence).matches()) {
            errors.add("addressCoincidence: invalid format");
        }
        if (zoneId != null && !StringUtils.isEmpty(zoneId) && !ContainerEntity.UUID_PATTERN.matcher(zoneId).matches()) {
            errors.add("zoneId: invalid UUID format");
        }
        if (limit != null && limit < 0) {
            errors.add("limit must be greater than or equal to 0");
        }
        if (limit != null && limit > 2000) {
            errors.add("limit must be less than or equal to 2000");
        }
        if (betweenLatitude != null && (betweenLatitude < -90.0 || betweenLatitude > 90.0)) {
            errors.add("betweenLatitude must be between -90.0 and 90.0");
        }
        if (betweenLongitude != null && (betweenLongitude < -180.0 || betweenLongitude > 180.0)) {
            errors.add("betweenLongitude must be between -180.0 and 180.0");
        }
        return errors;
    }
}