package com.scgm.routes.service;

import com.scgm.routes.dto.OptimizeRouteDto;
import com.scgm.routes.dto.OptimizedRouteResponse;
import com.scgm.routes.dto.RouteAssignmentDto;
import com.scgm.routes.entity.RouteAssignmentEntity.AssignmentStatus;
import java.util.List;

public interface RouteIntegrationService {
    
    OptimizedRouteResponse optimizeRoute(Long customerId, OptimizeRouteDto data);
    
    RouteAssignmentDto assignRoute(RouteAssignmentDto data);
    
    List<RouteAssignmentDto> getAssignments(String operatorId);
    
    RouteAssignmentDto updateAssignmentStatus(String id, AssignmentStatus status);
}
