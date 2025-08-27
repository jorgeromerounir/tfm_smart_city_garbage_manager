package com.scgm.customers.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import com.scgm.customers.entity.customer.CityEntity;
import com.scgm.customers.entity.customer.CustomerEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAddReq {

    private Long id;
    private String name;
    private String description;
    private Long cityId;
    private Boolean active;

    public static CustomerEntity toEntity(CustomerAddReq customerDto) {
        Instant currentInstant = Instant.now();
        return CustomerEntity.builder()
                .id(customerDto.getId())
                .name(customerDto.getName())
                .description(customerDto.getDescription())
                .city(customerDto.getCityId() != null ? CityEntity.builder().id(customerDto.getCityId()).build() : null)
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .active(customerDto.getActive())
                .build();
    }

}
