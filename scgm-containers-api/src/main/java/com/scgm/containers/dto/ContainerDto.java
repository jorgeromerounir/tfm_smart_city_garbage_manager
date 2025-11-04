package com.scgm.containers.dto;

import java.time.Instant;

import com.scgm.containers.entity.ContainerEntity;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;
import com.scgm.containers.util.WasteLevelUtil;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerDto {

    private String id;
    private Double latitude;
    private Double longitude;
    private Double temperature;
    private Double wasteLevelValue;
    private WasteLevel wasteLevelStatus;
    private String address;
    private Long cityId;
    private Long customerId;
    private Instant createdAt;
    private Instant updatedAt;
    private String zoneId;

    public static ContainerEntity toEntity(ContainerDto containerDto) {
        return ContainerEntity.builder()
                .id(containerDto.getId())
                .latitude(containerDto.getLatitude())
                .longitude(containerDto.getLongitude())
                .wasteLevelValue(containerDto.getWasteLevelValue())
                .wasteLevelStatus(WasteLevelUtil.getWasteLevelFromDouble(containerDto.getWasteLevelValue()))
                .temperature(containerDto.getTemperature())
                .address(containerDto.getAddress())
                .cityId(containerDto.getCityId())
                .customerId(containerDto.getCustomerId())
                .zoneId(containerDto.getZoneId())
                .createdAt(containerDto.getCreatedAt())
                .updatedAt(containerDto.getUpdatedAt())
                .build();
    }

    public static ContainerDto toDto(ContainerEntity containerEntity) {
        return ContainerDto.builder()
                .id(containerEntity.getId())
                .latitude(containerEntity.getLatitude())
                .longitude(containerEntity.getLongitude())
                .wasteLevelValue(containerEntity.getWasteLevelValue())
                .wasteLevelStatus(containerEntity.getWasteLevelStatus())
                .temperature(containerEntity.getTemperature())
                .address(containerEntity.getAddress())
                .cityId(containerEntity.getCityId())
                .customerId(containerEntity.getCustomerId())
                .zoneId(containerEntity.getZoneId())
                .createdAt(containerEntity.getCreatedAt())
                .updatedAt(containerEntity.getUpdatedAt())
                .build();
    }
}