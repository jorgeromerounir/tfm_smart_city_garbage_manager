package com.scgm.containers.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.containers.entity.ContainerEntity;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;
import com.scgm.containers.util.UuidUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerAddDto {

    private Double latitude;
    private Double longitude;
    private Double wasteLevelValue;
    private Double temperature;
    private String address;
    private Long cityId;
    private Long customerId;

    public static ContainerEntity toEntity(ContainerAddDto containerDto) {
        Instant currentInstant = Instant.now();
        return ContainerEntity.builder()
                .id(UuidUtil.generateUuidAsString())
                .latitude(containerDto.getLatitude())
                .longitude(containerDto.getLongitude())
                .wasteLevel(containerDto.getWasteLevelValue())
                .temperature(containerDto.getTemperature())
                .address(containerDto.getAddress())
                .cityId(containerDto.getCityId())
                .customerId(containerDto.getCustomerId())
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .build();
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (latitude == null)
            listErrors.add("latitude: is required");
        if (longitude == null)
            listErrors.add("longitude: is required");
        if (wasteLevelValue == null)
            listErrors.add("wasteLevelValue: is required");
        if (temperature == null)
            listErrors.add("temperature: is required");
        if (address == null || address.trim().isEmpty())
            listErrors.add("address: cannot be empty");
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        return listErrors;
    }

}