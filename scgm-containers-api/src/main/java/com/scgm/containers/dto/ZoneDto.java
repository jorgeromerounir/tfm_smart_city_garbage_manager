package com.scgm.containers.dto;

import java.time.Instant;

import com.scgm.containers.entity.ZoneEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneDto {

    private String id;
    private Double centerLatitude;
    private Double centerLongitude;
    private String name;
    private Long cityId;
    private Long customerId;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
    private String description;
    private String color;
    private Instant createdAt;
    private Instant updatedAt;

    public static ZoneEntity toEntity(ZoneDto zoneDto) {
        return ZoneEntity.builder()
                .id(zoneDto.getId())
                .centerLatitude(zoneDto.getCenterLatitude())
                .centerLongitude(zoneDto.getCenterLongitude())
                .name(zoneDto.getName())
                .cityId(zoneDto.getCityId())
                .customerId(zoneDto.getCustomerId())
                .startLat(zoneDto.getStartLat())
                .startLng(zoneDto.getStartLng())
                .endLat(zoneDto.getEndLat())
                .endLng(zoneDto.getEndLng())
                .description(zoneDto.getDescription())
                .color(zoneDto.getColor())
                .createdAt(zoneDto.getCreatedAt())
                .updatedAt(zoneDto.getUpdatedAt())
                .build();
    }

    public static ZoneDto toDto(ZoneEntity zoneEntity) {
        return ZoneDto.builder()
                .id(zoneEntity.getId())
                .centerLatitude(zoneEntity.getCenterLatitude())
                .centerLongitude(zoneEntity.getCenterLongitude())
                .name(zoneEntity.getName())
                .cityId(zoneEntity.getCityId())
                .customerId(zoneEntity.getCustomerId())
                .startLat(zoneEntity.getStartLat())
                .startLng(zoneEntity.getStartLng())
                .endLat(zoneEntity.getEndLat())
                .endLng(zoneEntity.getEndLng())
                .description(zoneEntity.getDescription())
                .color(zoneEntity.getColor())
                .createdAt(zoneEntity.getCreatedAt())
                .updatedAt(zoneEntity.getUpdatedAt())
                .build();
    }
}