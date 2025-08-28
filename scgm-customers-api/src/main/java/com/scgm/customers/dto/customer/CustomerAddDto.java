package com.scgm.customers.dto.customer;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.customers.entity.customer.CustomerEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAddDto {

    private String name;
    private String description;
    private Long cityId;
    private Boolean active;

    public static CustomerEntity toEntity(CustomerAddDto customerDto) {
        Instant currentInstant = Instant.now();
        return CustomerEntity.builder()
                .name(customerDto.getName())
                .description(customerDto.getDescription())
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .active(customerDto.getActive())
                .build();
    }

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
