package com.scgm.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.scgm.routes.entity.WasteLevel;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OptimizeRouteDto {

    private double startLat;
    private double startLng;
    private double endLat;
    private double endLng;
    private Long cityId;
    private List<WasteLevel> wasteTypes;

}