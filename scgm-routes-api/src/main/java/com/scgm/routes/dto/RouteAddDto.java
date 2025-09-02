package com.scgm.routes.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.scgm.routes.entity.RouteEntity;
import com.scgm.routes.entity.RouteEntity.RouteStatus;
import com.scgm.routes.util.UuidUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteAddDto {

    private LocalDate scheduledDate;
    private RouteStatus routeStatus;
    private Long cityId;
    private Long customerId;
    private String notes;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (scheduledDate == null)
            listErrors.add("scheduledDate: is required");
        if (routeStatus == null)
            listErrors.add("routeStatus: is required");
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        return listErrors;
    }

    public static RouteEntity toEntity(RouteAddDto addDto) {
        Instant now = Instant.now();
        return RouteEntity.builder()
                .id(UuidUtil.generateUuidAsString())
                .scheduledDate(addDto.getScheduledDate())
                .routeStatus(addDto.getRouteStatus())
                .cityId(addDto.getCityId())
                .customerId(addDto.getCustomerId())
                .notes(addDto.getNotes())
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

}