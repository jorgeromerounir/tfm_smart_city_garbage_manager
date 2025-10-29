package com.scgm.routes.config;

import java.math.BigDecimal;

import org.springframework.context.annotation.Configuration;

import com.scgm.routes.dto.TruckAddDto;
import com.scgm.routes.service.TruckService;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@AllArgsConstructor
@Slf4j
public class DataInitializationConfig {

    private final TruckService truckService;

    @PostConstruct
    public void initializeData() {
        initDefualtTrucks();
    }

    private void initDefualtTrucks() {
        try {
            var truckAdd1 = TruckAddDto.builder()
                    .name("Truck Default 1")
                    .licensePlate("ABC-111")
                    .capacity(new BigDecimal("1000.00"))
                    .cityId(1L)
                    .customerId(1L)
                    .available(true)
                    .build();
            var savedTruck1 = truckService.add(truckAdd1);
            log.info("Initial truck1 created with ID: {}", savedTruck1.getId());
            //----
            var truckAdd2 = TruckAddDto.builder()
                    .name("Truck Default 2")
                    .licensePlate("ABC-222")
                    .capacity(new BigDecimal("1000.00"))
                    .cityId(1L)
                    .customerId(1L)
                    .available(true)
                    .build();
            var savedTruck2 = truckService.add(truckAdd2);
            log.info("Initial truck2 created with ID: {}", savedTruck2.getId());
        } catch (Exception e) {
            log.warn("Error initializing truck data");
        }
    }
}