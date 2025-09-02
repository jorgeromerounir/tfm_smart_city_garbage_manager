package com.scgm.routes.dto.container;

import java.time.Instant;

import com.scgm.routes.entity.WasteLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerDto {

    private String id;
    private Double latitude;
    private Double longitude;
    private Double temperature;
    private Double wasteLevelValue;
    private WasteLevel wasteLevelStatus;
    private String address;
    private Long cityId;
    private Long customerId;
    private Instant createdAt;
    private Instant updatedAt;

}