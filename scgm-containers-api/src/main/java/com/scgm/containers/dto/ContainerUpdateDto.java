package com.scgm.containers.dto;

import java.util.ArrayList;
import java.util.List;
import java.time.Instant;

import com.scgm.containers.entity.ContainerEntity.WasteLevel;
import com.scgm.containers.entity.ContainerEntity;
import com.scgm.containers.util.WasteLevelUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerUpdateDto {

    private Double latitude;
    private Double longitude;
    private Double wasteLevelValue;
    private Double temperature;
    private String address;
    private Long cityId;
    private Long customerId;
    private String zoneId;

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

    public static ContainerEntity toEntity(ContainerUpdateDto updateDto, ContainerEntity existingContainer) {
        existingContainer.setLatitude(updateDto.getLatitude());
        existingContainer.setLongitude(updateDto.getLongitude());
        existingContainer.setWasteLevelValue(updateDto.getWasteLevelValue());
        existingContainer.setWasteLevelStatus(WasteLevelUtil.getWasteLevelFromDouble(updateDto.getWasteLevelValue()));
        existingContainer.setTemperature(updateDto.getTemperature());
        existingContainer.setAddress(updateDto.getAddress());
        existingContainer.setCityId(updateDto.getCityId());
        existingContainer.setCustomerId(updateDto.getCustomerId());
        existingContainer.setUpdatedAt(Instant.now());
        existingContainer.setZoneId(updateDto.getZoneId() != null ? updateDto.getZoneId() : existingContainer.getZoneId());
        return existingContainer;
    }

}