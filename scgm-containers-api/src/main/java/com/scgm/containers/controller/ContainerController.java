package com.scgm.containers.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scgm.containers.dto.BoundsDto;
import com.scgm.containers.dto.ContainerAddDto;
import com.scgm.containers.dto.ContainerAddSendorDto;
import com.scgm.containers.dto.ContainerDto;
import com.scgm.containers.dto.ContainerStatusSummaryDto;
import com.scgm.containers.dto.ContainerUpdateDto;
import com.scgm.containers.dto.ContainerZoneUpdateDto;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;
import com.scgm.containers.service.ContainerService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/containers")
@AllArgsConstructor
@Slf4j
public class ContainerController {

    private final ContainerService containerService;

    @PostMapping
    public ResponseEntity<ContainerDto> add(@RequestBody ContainerAddDto containerAdd) {
        log.info("Trying to add new container");
        var containerDto = containerService.add(containerAdd);
        return new ResponseEntity<>(containerDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContainerDto> findById(@PathVariable String id) {
        log.info("Finding container by ID");
        var containerOpt = containerService.findById(id);
        return containerOpt.map(container -> new ResponseEntity<>(container, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-address")
    public ResponseEntity<List<ContainerDto>> findByAddressContaining(@RequestParam String address) {
        log.info("Finding containers by address containing");
        List<ContainerDto> containers = containerService.findByAddressContaining(address);
        if (containers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(containers, HttpStatus.OK);
    }

    @GetMapping("/by-customer/{customerId}")
    public ResponseEntity<List<ContainerDto>> findByCustomerId(@PathVariable Long customerId) {
        log.info("Finding containers for customer with ID: {}", customerId);
        List<ContainerDto> containers = containerService.findByCustomerId(customerId);
        if (containers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(containers, HttpStatus.OK);
    }

    @GetMapping("/by-customer/{customerId}/city/{cityId}")
    public ResponseEntity<List<ContainerDto>> findByCustomerIdAndCityId(
        @PathVariable Long customerId, 
        @PathVariable Long cityId,
        @RequestParam(required = false) Integer limit,
        @RequestParam(required = false) Boolean hasZoneId) {
        log.info("Finding containers for customer ID: {}, city ID: {} with limit: {}, hasZoneId:{}", 
            customerId, cityId, limit, hasZoneId);
        List<ContainerDto> containers = containerService.findByCustomerIdAndCityId(customerId, cityId, limit, hasZoneId);
        if (containers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(containers, HttpStatus.OK);
    }

    @GetMapping("/by-customer/{customerId}/city/{cityId}/zone/{zoneId}")
    public ResponseEntity<List<ContainerDto>> findByCustomerIdAndCityIdAndZoneId(
        @PathVariable Long customerId, 
        @PathVariable Long cityId,
        @PathVariable String zoneId,
        @RequestParam(required = false) Integer limit) {
        log.info("Finding containers for customer ID: {}, city ID: {} and zoneId: {}", customerId, cityId, zoneId);
        List<ContainerDto> containers = containerService.findByCustomerIdAndCityIdAndZoneId(
            customerId, cityId, zoneId, limit);
        if (containers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(containers, HttpStatus.OK);
    }

    @PutMapping("/{containerId}")
    public ResponseEntity<ContainerDto> update(@PathVariable String containerId, 
        @RequestBody ContainerUpdateDto containerUpdate) {
        log.info("Trying to update container");
        var containerDto = containerService.update(containerId, containerUpdate);
        return new ResponseEntity<>(containerDto, HttpStatus.OK);
    }

    @DeleteMapping("/{containerId}")
    public ResponseEntity<Void> delete(@PathVariable String containerId) {
        log.info("Trying to delete container by ID");
        containerService.delete(containerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/status-summary/{cityId}")
    public ResponseEntity<ContainerStatusSummaryDto> getStatusSummary(@PathVariable Long cityId) {
        log.info("Getting status summary for city ID: {}", cityId);
        var summaryOpt = containerService.getStatusSummary(cityId);
        return summaryOpt.map(summary -> new ResponseEntity<>(summary, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/sensor-data")
    public ResponseEntity<ContainerDto> addSensorData(@RequestBody ContainerAddSendorDto containerAddSendor) {
        log.info("Adding sensor data");
        var containerDto = containerService.addSensorData(containerAddSendor);
        return new ResponseEntity<>(containerDto, HttpStatus.OK);
    }

    @GetMapping("/by-city-and-level/{cityId}")
    public ResponseEntity<List<ContainerDto>> findByCityAndLevelStatus(@PathVariable Long cityId, 
        @RequestParam List<WasteLevel> wasteLevelStatuses) {
        log.info("Finding containers for city ID: {} with waste level statuses: {}", cityId, wasteLevelStatuses);
        List<ContainerDto> containers = containerService.findByCityAndLevelStatus(cityId, wasteLevelStatuses);
        if (containers.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(containers, HttpStatus.OK);
    }

    @PutMapping("/by-customer/{customerId}/multiple-zones")
    public ResponseEntity<Void> updateMultipleZonesId(
        @PathVariable Long customerId,
        @RequestBody List<ContainerZoneUpdateDto> containerZoneUpdates) {
        log.info("Updating multiple zones for customer ID: {}", customerId);
        containerService.updateMultipleZonesId(customerId, containerZoneUpdates);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}