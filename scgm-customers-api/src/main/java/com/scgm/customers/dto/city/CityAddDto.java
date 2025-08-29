package com.scgm.customers.dto.city;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.customers.entity.city.CityEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityAddDto {

    private String name;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean active;

    public static CityEntity toEntity(CityAddDto cityDto) {
        Instant currentInstant = Instant.now();
        return CityEntity.builder()
                .name(cityDto.getName())
                .country(cityDto.getCountry())
                .latitude(cityDto.getLatitude())
                .longitude(cityDto.getLongitude())
                .active(cityDto.getActive())
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .build();
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (name == null || name.trim().isEmpty())
            listErrors.add("name: cannot be empty");
        if (country == null || country.trim().isEmpty())
            listErrors.add("country: cannot be empty");
        if (latitude == null)
            listErrors.add("latitude: is required");
        if (longitude == null)
            listErrors.add("longitude: is required");
        if (active == null)
            listErrors.add("active: is required");
        return listErrors;
    }

}