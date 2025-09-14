package com.scgm.gateway.decorator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scgm.gateway.dto.GatewayReqDto;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;

/**
 * This class is responsible for creating decorators for the GatewayReqDto object.
 * It uses the ObjectMapper to convert the raw request body into a GatewayReqDto object.
 * Depending on the HTTP method of the request, it creates a different decorator.
 */
@Component
@RequiredArgsConstructor
public class RequestDecoratorFactory {

    private final ObjectMapper objectMapper;


    /**
     * This method creates a decorator for the GatewayReqDto object.
     * It checks the HTTP method of the request and creates a different decorator depending on the method.
     * If the method is GET, it creates a GetRequestDecorator.
     * If the method is POST, it creates a PostRequestDecorator.
     * If the method is neither GET nor POST, it throws an IllegalArgumentException.
     *
     * @param request the GatewayReqDto object to be decorated
     * @return a ServerHttpRequestDecorator that decorates the GatewayReqDto object
     * @throws IllegalArgumentException if the HTTP method of the request is neither GET nor POST
     */
        public ServerHttpRequestDecorator getDecorator(GatewayReqDto request) {
            return switch (request.getTargetMethod().name().toUpperCase()) {
                case "GET" -> new GetRequestDecorator(request);
                case "POST" -> new PostRequestDecorator(request, objectMapper);
                case "PUT" -> new PutRequestDecorator(request, objectMapper);
                case "DELETE" -> new DeleteRequestDecorator(request, objectMapper);
                case "PATCH" -> new PatchRequestDecorator(request, objectMapper);
                default -> throw new IllegalArgumentException("Invalid http method");
            };
        }
}
