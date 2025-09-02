package com.scgm.containers.dto;

import java.util.ArrayList;
import java.util.List;

import com.scgm.containers.entity.ContainerEntity.WasteLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerAddSendorDto {

    private String id;
    private Double wasteLevelValue;
    private Double temperature;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (id == null || id.trim().isEmpty())
            listErrors.add("id: cannot be empty");
        if (wasteLevelValue == null)
            listErrors.add("wasteLevelValue: is required");
        if (temperature == null)
            listErrors.add("temperature: is required");
        return listErrors;
    }

}