package com.scgm.routes.client.container;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.scgm.routes.dto.container.ContainerDto;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ContainerClientImpl implements ContainerClient {

    private final RestTemplate restTemplate;
    
    @Value("${scgm.containers.api.url:http://localhost:8181}")
    private String containersApiUrl;

    public ContainerClientImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public List<ContainerDto> findByCityAndLevelStatus(Long cityId, List<String> wasteLevelStatuses) {
        log.info("Calling containers API to find containers for city ID: {} with waste level statuses: {}", cityId, wasteLevelStatuses);
        String url = UriComponentsBuilder.fromHttpUrl(containersApiUrl)
                .path("/api/v1/containers/by-city-and-level/{cityId}")
                .queryParam("wasteLevelStatuses", wasteLevelStatuses.toArray())
                .buildAndExpand(cityId)
                .toUriString();
        try {
            var response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ContainerDto>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error calling containers API: {}", e.getMessage(), e);
            return Arrays.asList();
        }
    }

    @Override
    public List<ContainerDto> findByCustomerIdAndCityIdAndBounds(Long customerId, Long cityId, 
        Double startLat, Double endLat, Double startLng, Double endLng, Integer limit) {
        log.info("Calling containers API to find containers for customer ID: {}, city ID: {} and bounds: [{},{},{},{}] with limit: {}", 
            customerId, cityId, startLat, endLat, startLng, endLng, limit);
        String url = UriComponentsBuilder.fromHttpUrl(containersApiUrl)
                .path("/api/v1/containers/by-customer/{customerId}/city/{cityId}/bounds")
                .queryParam("startLat", startLat)
                .queryParam("endLat", endLat)
                .queryParam("startLng", startLng)
                .queryParam("endLng", endLng)
                .queryParam("limit", limit)
                .buildAndExpand(customerId, cityId)
                .toUriString();
        try {
            var response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ContainerDto>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error calling containers API: {}", e.getMessage(), e);
            return Arrays.asList();
        }
    }

}