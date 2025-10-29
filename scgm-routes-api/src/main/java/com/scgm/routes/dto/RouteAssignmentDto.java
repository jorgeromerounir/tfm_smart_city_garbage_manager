package com.scgm.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteAssignmentDto {
    private String id;
    private String routeName;
    private OptimizedRouteResponse routeData;
    private String truckId;
    private String operatorId;
    private String supervisorId;
    private String city;
    private AssignmentStatus status;
}