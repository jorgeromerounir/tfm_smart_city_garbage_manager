package com.scgm.containers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerStatusSummaryDto {

    private Integer light;
    private Integer medium;
    private Integer heavy;
    private Integer total;
}
