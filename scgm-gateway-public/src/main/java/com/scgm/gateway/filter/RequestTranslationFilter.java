package com.scgm.gateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scgm.gateway.decorator.RequestDecoratorFactory;
import com.scgm.gateway.dto.DefaultResponseDto;
import com.scgm.gateway.dto.GatewayReqDto;
import com.scgm.gateway.utils.RequestBodyExtractor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.RequestEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import reactor.core.publisher.Mono;

import com.scgm.gateway.dto.AuthEndpointDto;
import com.scgm.gateway.exceptions.UnauthorizedException;

/**
 * This class is a custom filter for the Spring Cloud Gateway. It is responsible for translating incoming requests.
 * It uses the RequestBodyExtractor to extract the body of the request and the RequestDecoratorFactory to create a decorator for the request.
 * The decorator is used to modify the request before it is forwarded to the downstream service.
 * By default, the response status is set to 400 (Bad Request). This will be overridden if the request is valid.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RequestTranslationFilter implements GlobalFilter {

    private final RequestBodyExtractor requestBodyExtractor;
    private final RequestDecoratorFactory requestDecoratorFactory;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    //private final String authServiceUrl = "http://localhost:8763/scgm-auth-service/api/v1/auth/endpoint";
    private final String authServiceUrl = "http://localhost:8081/api/v1/auth/endpoint";

    /**
     * Main filter method that validates POST requests and forwards them through the chain.
     *
     * @param exchange the current server web exchange
     * @param chain the gateway filter chain
     * @return a Mono<Void> that indicates when request handling is complete
     */
    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {
        // By default, set the response status to 400. This will be overridden if the request is valid.
        exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
        if (invalidRequest(exchange)) {
            log.info("This request cannot be performed, invalid method is not a POST request");
            return handleInvalidResponse(exchange);
        } else {
            return tryProcessPostRequest(exchange, chain);
        }
    }

    /**
     * Validates if request is invalid (non-POST or POST without content-type).
     *
     * @param exchange the current server web exchange
     * @return true if the request is invalid, false otherwise
     */
    private boolean invalidRequest(ServerWebExchange exchange){
        return !exchange.getRequest().getMethod().equals(HttpMethod.POST) || 
            (exchange.getRequest().getMethod().equals(HttpMethod.POST) && 
             exchange.getRequest().getHeaders().getContentType() == null);
    }

    /**
     * Handles invalid requests by returning a BAD_REQUEST JSON response.
     *
     * @param exchange the current server web exchange
     * @return a Mono<Void> containing the error response
     */
    private Mono<Void> handleInvalidResponse(ServerWebExchange exchange) {
        try {
            var errorResponse = new DefaultResponseDto(
                "This request cannot be performed, invalid method", 
                HttpStatus.BAD_REQUEST.value());
            String responseBody = objectMapper.writeValueAsString(errorResponse);
            return addResponse(exchange, responseBody, HttpStatus.BAD_REQUEST);
        } catch (JsonProcessingException e) {
            log.error("Error serializing invalid response", e);
            return exchange.getResponse().setComplete();
        }
    }

    /**
     * Processes valid POST requests by extracting body and forwarding through chain.
     *
     * @param exchange the current server web exchange
     * @param chain the gateway filter chain
     * @return a Mono<Void> that indicates when request processing is complete
     */
    private Mono<Void> tryProcessPostRequest(ServerWebExchange exchange, GatewayFilterChain chain) {
        return DataBufferUtils.join(exchange.getRequest().getBody())
                .flatMap(dataBuffer -> {
                    try {
                        GatewayReqDto request = requestBodyExtractor.getRequest(exchange, dataBuffer);
                        ServerHttpRequest mutatedRequest = requestDecoratorFactory.getDecorator(request);
                        validateAuthorization(mutatedRequest, exchange);
                        //log.info("Trying request: {} {}", mutatedRequest.getMethod(), mutatedRequest.getURI());
                        //log.info("Trying request headers: {}", mutatedRequest.getHeaders());
                        //RouteToRequestUrlFilter writes the URI to the exchange attributes *before* any global filters run.
                        exchange.getAttributes().put(ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR, mutatedRequest.getURI());
                        if(request.getQueryParams() != null) {
                            request.getQueryParams().clear();
                        }
                        log.info("Launch roxying request: {} {}", mutatedRequest.getMethod(), mutatedRequest.getURI());
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    } catch (Exception e) {
                        if (e instanceof UnauthorizedException) {
                            log.error("Unauthorized request: {}", e.getMessage());
                            return handleUnauthorizedResponse(exchange);
                        }
                        log.error("Error processing request: {}", e.getMessage(), e);
                        return handleException(exchange);
                    }
                });
    }

    private Mono<Void> handleUnauthorizedResponse(ServerWebExchange exchange) {
        try {
            var errorResponse = new DefaultResponseDto(
                "Unauthorized request, invalid access", 
                HttpStatus.UNAUTHORIZED.value());
            String responseBody = objectMapper.writeValueAsString(errorResponse);
            return addResponse(exchange, responseBody, HttpStatus.UNAUTHORIZED);
        } catch (JsonProcessingException e) {
            log.error("Error serializing invalid response", e);
            return exchange.getResponse().setComplete();
        }
    }

    private void validateAuthorization(ServerHttpRequest mutatedRequest, ServerWebExchange exchange) {
        ServerHttpRequest originalRequest = exchange.getRequest();
        HttpMethod method = mutatedRequest.getMethod();
        String httpMethod = method.name();
        URI uri = originalRequest.getURI();
        String authorizationHeader = originalRequest.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        log.info("----> To authorizae --- HTTP Method: {}, URI: {}, Authorization: {}, Headers: {}", 
            httpMethod, uri, authorizationHeader, originalRequest.getHeaders());
        // Rest template
        HttpHeaders reqHeaders = new HttpHeaders();
        reqHeaders.setContentType(MediaType.APPLICATION_JSON);
        var authEndpointDto = new AuthEndpointDto();
        authEndpointDto.setUrl(uri.toString());
        authEndpointDto.setMethod(httpMethod);
        authEndpointDto.setAccessToken(authorizationHeader);
        // POST request
        if (authEndpointDto.validate().isEmpty()) {
            try {
                RequestEntity<AuthEndpointDto> requestEntity = RequestEntity
                        .post(new URI(this.authServiceUrl))
                        .headers(reqHeaders)
                        .body(authEndpointDto);
                ResponseEntity<Void> response = this.restTemplate.exchange(
                        this.authServiceUrl,
                        HttpMethod.POST,
                        requestEntity,
                        Void.class
                );
                if (HttpStatus.OK.equals(response.getStatusCode())) {
                    log.info("Authorization validated successfully for method: {} - Status: {} - Response: {}", 
                        httpMethod, response.getStatusCode(), response.getBody());
                } else {
                    log.error("Authorization failed for method: {} - Status: {} - Response: {}", httpMethod, 
                    response.getStatusCode(), response.getBody());
                    throw new RuntimeException("Authorization validation failed with status: " + response.getStatusCode());
                }
            } catch (Exception e) {
                log.error("Error calling authorization service: {}", e.getMessage());
                throw new UnauthorizedException("Authorization service unavailable: ", e);
            }
        }
    }
    
    /**
     * Handles processing exceptions by returning an INTERNAL_SERVER_ERROR JSON response.
     *
     * @param exchange the current server web exchange
     * @return a Mono<Void> containing the error response
     */
    private Mono<Void> handleException(ServerWebExchange exchange) {
        try {
            var errorResponse = new DefaultResponseDto("Internal server error, unexpected error", 
                HttpStatus.INTERNAL_SERVER_ERROR.value());
            String responseBody = objectMapper.writeValueAsString(errorResponse);
            return addResponse(exchange, responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (JsonProcessingException e) {
            log.error("Error serializing exception response", e);
            return exchange.getResponse().setComplete();
        }
    }

    /**
     * Creates and writes a JSON response with specified status and body.
     *
     * @param exchange the current server web exchange
     * @param responseBody the JSON response body as string
     * @param status the HTTP status code to set
     * @return a Mono<Void> that indicates when response writing is complete
     */
    private Mono<Void> addResponse(ServerWebExchange exchange, String responseBody, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();
        DataBuffer buffer = bufferFactory.wrap(responseBody.getBytes());
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}
