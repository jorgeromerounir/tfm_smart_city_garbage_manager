package com.scgm.containers.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.containers.entity.ZoneEntity;
import com.scgm.containers.util.UuidUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneAddDto {

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

    public static ZoneEntity toEntity(ZoneAddDto zoneDto) {
        Instant currentInstant = Instant.now();
        return ZoneEntity.builder()
                .id(UuidUtil.generateUuidAsString())
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
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .build();
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (centerLatitude == null)
            listErrors.add("centerLatitude: is required");
        if (centerLongitude == null)
            listErrors.add("centerLongitude: is required");
        if (name == null || name.trim().isEmpty())
            listErrors.add("name: cannot be empty");
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        if (startLat == null)
            listErrors.add("startLat: is required");
        if (startLng == null)
            listErrors.add("startLng: is required");
        if (endLat == null)
            listErrors.add("endLat: is required");
        if (endLng == null)
            listErrors.add("endLng: is required");
        if (color == null || color.trim().isEmpty())
            listErrors.add("color: cannot be empty");
        return listErrors;
    }

}