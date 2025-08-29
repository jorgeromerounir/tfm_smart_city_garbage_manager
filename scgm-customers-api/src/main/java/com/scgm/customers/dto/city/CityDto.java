package com.scgm.customers.dto.city;

import java.time.Instant;

import com.scgm.customers.entity.city.CityEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityDto {

    private Long id;
    private String name;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;

    public static CityEntity toEntity(CityDto cityDto) {
        return CityEntity.builder()
                .id(cityDto.getId())
                .name(cityDto.getName())
                .country(cityDto.getCountry())
                .latitude(cityDto.getLatitude())
                .longitude(cityDto.getLongitude())
                .active(cityDto.getActive())
                .createdAt(cityDto.getCreatedAt())
                .updatedAt(cityDto.getUpdatedAt())
                .build();
    }

    public static CityDto toDto(CityEntity cityEntity) {
        return CityDto.builder()
                .id(cityEntity.getId())
                .name(cityEntity.getName())
                .country(cityEntity.getCountry())
                .latitude(cityEntity.getLatitude())
                .longitude(cityEntity.getLongitude())
                .active(cityEntity.getActive())
                .createdAt(cityEntity.getCreatedAt())
                .updatedAt(cityEntity.getUpdatedAt())
                .build();
    }
}