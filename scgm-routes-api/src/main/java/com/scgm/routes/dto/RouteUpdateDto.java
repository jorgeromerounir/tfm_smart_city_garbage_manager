package com.scgm.routes.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.scgm.routes.entity.RouteEntity.RouteStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteUpdateDto {

    private LocalDate scheduledDate;
    private RouteStatus routeStatus;
    private String notes;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (scheduledDate == null)
            listErrors.add("scheduledDate: is required");
        if (routeStatus == null)
            listErrors.add("routeStatus: is required");
        return listErrors;
    }

}