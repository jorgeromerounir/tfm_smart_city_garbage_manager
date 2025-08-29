package com.scgm.customers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import com.scgm.customers.entity.CustomerEntity;
import com.scgm.customers.entity.customer.CityEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {

    private Long id;
    private String name;
    private String description;
    private Long cityId;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean active;

    public static CustomerEntity toEntity(CustomerDto customerDto) {
        return CustomerEntity.builder()
                .id(customerDto.getId())
                .name(customerDto.getName())
                .description(customerDto.getDescription())
                .city(customerDto.getCityId() != null ? CityEntity.builder().id(customerDto.getCityId()).build() : null)
                .createdAt(customerDto.getCreatedAt())
                .updatedAt(customerDto.getUpdatedAt())
                .active(customerDto.getActive())
                .build();
    }

    public static CustomerDto toDto(CustomerEntity customerEntity) {
        return CustomerDto.builder()
                .id(customerEntity.getId())
                .name(customerEntity.getName())
                .description(customerEntity.getDescription())
                .cityId(customerEntity.getCity() != null ? customerEntity.getCity().getId() : null)
                .createdAt(customerEntity.getCreatedAt())
                .updatedAt(customerEntity.getUpdatedAt())
                .active(customerEntity.getActive())
                .build();
    }
}
