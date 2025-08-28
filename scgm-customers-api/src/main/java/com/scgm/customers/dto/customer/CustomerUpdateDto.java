package com.scgm.customers.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.customers.entity.customer.CityEntity;
import com.scgm.customers.entity.customer.CustomerEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerUpdateDto {

    private String name;
    private String description;
    private Long cityId;
    private Boolean active;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (name == null || name.trim().isEmpty())
            listErrors.add("name: cannot be empty");
        if (cityId == null)
            listErrors.add("city: is required");
        if (active == null)
            listErrors.add("active: is required");
        return listErrors;
    }

}
