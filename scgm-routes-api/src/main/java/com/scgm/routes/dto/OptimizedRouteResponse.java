package com.scgm.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizedRouteResponse {
    private List<RouteResult> routes;
    private double totalDistance;
    private int containerCount;
    private int estimatedTime;
    private int trucksUsed;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RouteResult {
        private String truckId;
        private String truckName;
        private List<Point> points;
    }
}