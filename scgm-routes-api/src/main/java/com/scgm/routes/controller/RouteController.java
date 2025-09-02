package com.scgm.routes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scgm.routes.dto.RouteAddDto;
import com.scgm.routes.dto.RouteDto;
import com.scgm.routes.dto.RouteUpdateDto;
import com.scgm.routes.service.RouteService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/routes")
@AllArgsConstructor
@Slf4j
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<RouteDto> add(@RequestBody RouteAddDto routeAdd) {
        log.debug("Trying to add new route");
        var routeDto = routeService.add(routeAdd);
        return new ResponseEntity<>(routeDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDto> findById(@PathVariable String id) {
        var routeOpt = routeService.findById(id);
        return routeOpt.map(route -> new ResponseEntity<>(route, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{routeId}")
    public ResponseEntity<RouteDto> update(@PathVariable String routeId, 
        @RequestBody RouteUpdateDto routeUpdate) {
        log.debug("Trying to update route with ID: {}", routeId);
        var routeDto = routeService.update(routeId, routeUpdate);
        return new ResponseEntity<>(routeDto, HttpStatus.OK);
    }

    @DeleteMapping("/{routeId}")
    public ResponseEntity<Void> delete(@PathVariable String routeId) {
        log.debug("Trying to delete route with ID: {}", routeId);
        routeService.delete(routeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}