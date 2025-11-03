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

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.dto.TruckDto;
import com.scgm.routes.dto.TruckUpdateDto;
import com.scgm.routes.service.TruckService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/trucks")
@AllArgsConstructor
@Slf4j
public class TruckController {

    private final TruckService truckService;

    @PostMapping("/by-customer/{customerId}")
    public ResponseEntity<TruckDto> add(@PathVariable Long customerId, @RequestBody TruckAddDto truckAdd) {
        log.info("Trying to add new truck for customer ID: {}", customerId);
        var truckDto = truckService.add(truckAdd);
        return new ResponseEntity<>(truckDto, HttpStatus.CREATED);
    }

    @GetMapping("/by-customer/{customerId}/truck/{id}")
    public ResponseEntity<TruckDto> findById(@PathVariable Long customerId, @PathVariable String id) {
        log.info("Finding truck by ID: {} for customer ID: {}", id, customerId);
        var truckOpt = truckService.findById(id);
        return truckOpt.map(truck -> new ResponseEntity<>(truck, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-customer/{customerId}/city/{cityId}")
    public ResponseEntity<List<TruckDto>> findByCustomerCity(
        @PathVariable Long customerId, 
        @PathVariable Long cityId,
        @RequestParam(required = false) Boolean available,
        @RequestParam(required = false) String nameCoincidence,
        @RequestParam(required = false) Integer limit) {
        log.info("Finding trucks for customer ID: {}, city ID: {} with available: {}, nameCoincidence: {}, limit: {}", 
            customerId, cityId, available, nameCoincidence, limit);
        List<TruckDto> trucks;
        if (available != null) {
            trucks = truckService.findByCustomerCityAndAvailable(customerId, cityId, available);
        } else {
            trucks = truckService.findByCustomerCity(customerId, cityId, nameCoincidence, limit);
        }
        if (trucks.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(trucks, HttpStatus.OK);
    }

    @PutMapping("/by-customer/{customerId}/truck/{truckId}")
    public ResponseEntity<TruckDto> update(@PathVariable Long customerId, @PathVariable String truckId, 
        @RequestBody TruckUpdateDto truckUpdate) {
        log.info("Trying to update truck with ID: {} for customer ID: {}", truckId, customerId);
        var truckDto = truckService.update(truckId, truckUpdate);
        return new ResponseEntity<>(truckDto, HttpStatus.OK);
    }

    @DeleteMapping("/by-customer/{customerId}/truck/{truckId}")
    public ResponseEntity<Void> delete(@PathVariable Long customerId, @PathVariable String truckId) {
        log.info("Trying to delete truck with ID: {} for customer ID: {}", truckId, customerId);
        truckService.delete(truckId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}