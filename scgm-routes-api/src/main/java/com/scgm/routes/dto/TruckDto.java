package com.scgm.routes.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.scgm.routes.entity.TruckEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TruckDto {

    private String id;
    private String name;
    private String licensePlate;
    private BigDecimal capacity;
    private Long cityId;
    private Long customerId;
    private Boolean available;
    private Instant createdAt;
    private Instant updatedAt;

    public static TruckDto toDto(TruckEntity entity) {
        return TruckDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .licensePlate(entity.getLicensePlate())
                .capacity(entity.getCapacity())
                .cityId(entity.getCityId())
                .customerId(entity.getCustomerId())
                .available(entity.getAvailable())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static TruckEntity toEntity(TruckDto dto) {
        return TruckEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .licensePlate(dto.getLicensePlate())
                .capacity(dto.getCapacity())
                .cityId(dto.getCityId())
                .customerId(dto.getCustomerId())
                .available(dto.getAvailable())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}