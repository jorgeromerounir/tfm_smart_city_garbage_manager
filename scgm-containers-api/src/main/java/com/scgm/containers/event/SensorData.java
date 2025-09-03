package com.scgm.containers.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SensorData {
    private String containerId;
    private Double wasteLevelValue;
    private Double temperature;
}
