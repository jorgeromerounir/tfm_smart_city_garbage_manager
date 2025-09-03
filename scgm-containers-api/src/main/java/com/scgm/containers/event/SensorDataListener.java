package com.scgm.containers.event;

import com.scgm.containers.dto.ContainerAddSendorDto;
import com.scgm.containers.service.ContainerServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SensorDataListener {
    
    private final ContainerServiceImpl containerService;
    
    @RabbitListener(queues = "sensor.data.queue")
    public void handleSensorData(SensorData sensorData) {
        log.info("Received sensor data for container: {} - wasteLevelValue: {}, temperature: {}°C", 
                sensorData.getContainerId(), sensorData.getWasteLevelValue(), sensorData.getTemperature());
        ContainerAddSendorDto sensorDto = ContainerAddSendorDto.builder()
                .id(sensorData.getContainerId())
                .wasteLevelValue(sensorData.getWasteLevelValue())
                .temperature(sensorData.getTemperature())
                .build();
        containerService.addSensorData(sensorDto);
    }
}