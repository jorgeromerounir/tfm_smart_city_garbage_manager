package com.scgm.customers.dto.city;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityUpdateDto {

    private String name;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean active;

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