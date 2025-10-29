package com.scgm.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Point {
    private double lat;
    private double lng;
    private String id;
    private Integer priority;
    
    public Point(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
        this.priority = 1;
    }
}