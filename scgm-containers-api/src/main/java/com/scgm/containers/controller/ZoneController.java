package com.scgm.containers.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.scgm.containers.dto.ZoneAddDto;
import com.scgm.containers.dto.ZoneDto;
import com.scgm.containers.dto.ZoneUpdateDto;
import com.scgm.containers.service.ZoneService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/zones")
@AllArgsConstructor
@Slf4j
public class ZoneController {

    private final ZoneService zoneService;

    @PostMapping
    public ResponseEntity<ZoneDto> add(@RequestBody ZoneAddDto zoneAdd) {
        log.info("Trying to add new zone");
        var zoneDto = zoneService.add(zoneAdd);
        return new ResponseEntity<>(zoneDto, HttpStatus.CREATED);
    }

    @PostMapping("/multiple/by-customer/{customerId}")
    public ResponseEntity<List<ZoneDto>> addMultiple(@PathVariable Long customerId, 
        @RequestBody List<ZoneAddDto> zonesAdd) {
        log.info("Trying to add {} new zones for customerId: {}", customerId, zonesAdd.size());
        var zoneDtos = zoneService.addMultiple(zonesAdd);
        return new ResponseEntity<>(zoneDtos, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZoneDto> findById(@PathVariable String id) {
        log.info("Finding zone by ID");
        var zoneOpt = zoneService.findById(id);
        return zoneOpt.map(zone -> new ResponseEntity<>(zone, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-customer/{customerId}/city/{cityId}")
    public ResponseEntity<List<ZoneDto>> findByCustomerIdAndCityId(
        @PathVariable Long customerId,
        @PathVariable Long cityId) {
        log.info("Finding zones for customer ID: {}, city ID: {}", customerId, cityId);
        List<ZoneDto> zones = zoneService.findByCustomerIdAndCityId(customerId, cityId);
        if (zones.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(zones, HttpStatus.OK);
    }

    @PutMapping("/{zoneId}")
    public ResponseEntity<ZoneDto> update(@PathVariable String zoneId, 
        @RequestBody ZoneUpdateDto zoneUpdate) {
        log.info("Trying to update zone");
        var zoneDto = zoneService.update(zoneId, zoneUpdate);
        return new ResponseEntity<>(zoneDto, HttpStatus.OK);
    }

    @DeleteMapping("/by-customer/{customerId}/zone-id/{zoneId}")
    public ResponseEntity<Void> delete(
        @PathVariable Long customerId,
        @PathVariable String zoneId) {
        log.info("Trying to delete zone by ID for customerId:{}", customerId);
        zoneService.delete(zoneId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}