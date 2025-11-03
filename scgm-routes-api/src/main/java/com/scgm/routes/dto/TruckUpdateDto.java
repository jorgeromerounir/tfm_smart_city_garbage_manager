package com.scgm.routes.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.scgm.routes.entity.TruckEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TruckUpdateDto {

    private String name;
    private String licensePlate;
    private BigDecimal capacity;
    private Boolean available;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (!StringUtils.isEmpty(getName()) && !TruckEntity.INJECTION_PATTERN.matcher(getName()).matches()) {
            listErrors.add("name: invalid format");
        }
        if (!StringUtils.isEmpty(getLicensePlate()) && !TruckEntity.LICENSE_PLATE_PATTERN.matcher(getLicensePlate()).matches()) {
            listErrors.add("licensePlate: invalid format");
        }
        if (getCapacity() != null && capacity.compareTo(BigDecimal.ZERO) <= 0) {
            listErrors.add("capacity: must be greater than zero");
        }
        return listErrors;
    }

    public static TruckEntity toEntity(TruckUpdateDto dto, TruckEntity existing) {
        if (!StringUtils.isEmpty(dto.getName())) {
            existing.setName(dto.getName());
        }
        if (!StringUtils.isEmpty(dto.getLicensePlate())) {
            existing.setLicensePlate(dto.getLicensePlate());
        }
        if (dto.getCapacity() != null) {
            existing.setCapacity(dto.getCapacity());
        }
        if (dto.getAvailable() != null) {
            existing.setAvailable(dto.getAvailable());
        }
        existing.setUpdatedAt(Instant.now());
        return existing;
    }
}