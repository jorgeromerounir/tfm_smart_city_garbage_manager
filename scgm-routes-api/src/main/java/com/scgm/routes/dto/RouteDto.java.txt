package com.scgm.routes.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.scgm.routes.entity.RouteEntity;
import com.scgm.routes.entity.RouteEntity.RouteStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteDto {

    private String id;
    private LocalDate scheduledDate;
    private RouteStatus routeStatus;
    private Long cityId;
    private Long customerId;
    private Instant createdAt;
    private Instant updatedAt;
    private String notes;

    public static RouteDto toDto(RouteEntity entity) {
        return RouteDto.builder()
                .id(entity.getId())
                .scheduledDate(entity.getScheduledDate())
                .routeStatus(entity.getRouteStatus())
                .cityId(entity.getCityId())
                .customerId(entity.getCustomerId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .notes(entity.getNotes())
                .build();
    }

}