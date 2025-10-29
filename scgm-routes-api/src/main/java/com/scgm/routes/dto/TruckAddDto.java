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
public class TruckAddDto {

    private String name;
    private String licensePlate;
    private BigDecimal capacity;
    private Long cityId;
    private Long customerId;
    @Builder.Default
    private Boolean available = true;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(getName()))
            listErrors.add("name: is required");
        if (StringUtils.isEmpty(getLicensePlate()))
            listErrors.add("licensePlate: is required");
        if (getCapacity() == null)
            listErrors.add("capacity: is required");
        if (getCityId() == null)
            listErrors.add("cityId: is required");
        if (getCustomerId() == null)
            listErrors.add("customerId: is required");
        return listErrors;
    }

    public static TruckEntity toEntity(TruckAddDto dto) {
        Instant now = Instant.now();
        return TruckEntity.builder()
                .name(dto.getName())
                .licensePlate(dto.getLicensePlate())
                .capacity(dto.getCapacity())
                .cityId(dto.getCityId())
                .customerId(dto.getCustomerId())
                .available(dto.getAvailable())
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}