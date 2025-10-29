package com.scgm.routes.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.scgm.routes.dto.AssignmentStatus;
import com.scgm.routes.dto.OptimizeRouteDto;
import com.scgm.routes.dto.OptimizedRouteResponse;
import com.scgm.routes.dto.RouteAssignmentDto;
import com.scgm.routes.service.RouteIntegrationService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/routes")
@AllArgsConstructor
@Slf4j
public class RouteController {

    //private final RouteService routeService;
    private final RouteIntegrationService routeIntegrationService;

    /*@PostMapping
    public ResponseEntity<RouteDto> add(@RequestBody RouteAddDto routeAdd) {
        log.info("Trying to add new route");
        var routeDto = routeService.add(routeAdd);
        return new ResponseEntity<>(routeDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDto> findById(@PathVariable String id) {
        log.info("Finding route with ID: {}", id);
        var routeOpt = routeService.findById(id);
        return routeOpt.map(route -> new ResponseEntity<>(route, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{routeId}")
    public ResponseEntity<RouteDto> update(@PathVariable String routeId, 
        @RequestBody RouteUpdateDto routeUpdate) {
        log.info("Trying to update route with ID: {}", routeId);
        var routeDto = routeService.update(routeId, routeUpdate);
        return new ResponseEntity<>(routeDto, HttpStatus.OK);
    }

    @DeleteMapping("/{routeId}")
    public ResponseEntity<Void> delete(@PathVariable String routeId) {
        log.info("Trying to delete route with ID: {}", routeId);
        routeService.delete(routeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }*/

    @PostMapping("/optimize-by-customer/{customerId}")
    public ResponseEntity<OptimizedRouteResponse> optimizeRoute(@PathVariable Long customerId, @RequestBody OptimizeRouteDto data) {
        log.info("Optimizing route for customerId: {} city: {}", customerId, data.getCityId());
        var response = routeIntegrationService.optimizeRoute(customerId, data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/assign")
    public ResponseEntity<RouteAssignmentDto> assignRoute(@RequestBody RouteAssignmentDto data) {
        log.info("Assigning route: {}", data.getRouteName());
        var assignment = routeIntegrationService.assignRoute(data);
        return new ResponseEntity<>(assignment, HttpStatus.CREATED);
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<RouteAssignmentDto>> getAssignments(@RequestParam(required = false) String operatorId) {
        log.info("Getting assignments for operator: {}", operatorId);
        List<RouteAssignmentDto> assignments = routeIntegrationService.getAssignments(operatorId);
        if (assignments.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(assignments, HttpStatus.OK);
    }

    @PutMapping("/assignments/{id}/status")
    public ResponseEntity<RouteAssignmentDto> updateAssignmentStatus(@PathVariable String id, 
        @RequestBody AssignmentStatusRequest request) {
        log.info("Updating assignment {} to status: {}", id, request.getStatus());
        var assignment = routeIntegrationService.updateAssignmentStatus(id, request.getStatus());
        return new ResponseEntity<>(assignment, HttpStatus.OK);
    }

    public static class AssignmentStatusRequest {
        private AssignmentStatus status;
        
        public AssignmentStatus getStatus() {
            return status;
        }
        
        public void setStatus(AssignmentStatus status) {
            this.status = status;
        }
    }

}