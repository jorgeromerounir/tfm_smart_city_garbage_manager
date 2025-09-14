package com.scgm.gateway.decorator;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.web.util.UriComponentsBuilder;

import com.scgm.gateway.dto.GatewayReqDto;

import reactor.core.publisher.Flux;

import java.net.URI;


/**
 * This class is a decorator for the GatewayReqDto object for GET requests.
 * It extends the ServerHttpRequestDecorator class and overrides its methods to modify the request.
 */
@Slf4j
public class GetRequestDecorator extends ServerHttpRequestDecorator {

    private final GatewayReqDto gatewayReqDto;


    public GetRequestDecorator(GatewayReqDto gatewayReqDto) {
        super(gatewayReqDto.getExchange().getRequest());
        this.gatewayReqDto = gatewayReqDto;
    }

    /**
     * This method overrides the getMethod method of the ServerHttpRequestDecorator class.
     * It returns the HTTP method of the request, which is GET.
     *
     * @return the HTTP method of the request
     */
    @Override
    @NonNull
    public HttpMethod getMethod() {
        return HttpMethod.GET;
    }

    /**
     * This method overrides the getURI method of the ServerHttpRequestDecorator class.
     * It returns the URI of the request, including any query parameters.
     *
     * @return the URI of the request
     */
    @Override
    @NonNull
    public URI getURI() {
        //log.info("Trying GET queryParams: {}", gatewayReqDto.getQueryParams());
        return UriComponentsBuilder
                .fromUri((URI) gatewayReqDto.getExchange().getAttributes().get(ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR))
                .queryParams(gatewayReqDto.getQueryParams())
                .build()
                .toUri();
    }

    /**
     * This method overrides the getHeaders method of the ServerHttpRequestDecorator class.
     * It returns the headers of the request.
     *
     * @return the headers of the request
     */
    @Override
    @NonNull
    public HttpHeaders getHeaders() {
        return gatewayReqDto.getHeaders();
    }

    /**
     * This method overrides the getBody method of the ServerHttpRequestDecorator class.
     * Since GET requests do not have a body, it returns an empty Flux of DataBuffers.
     *
     * @return an empty Flux of DataBuffers
     */
    @Override
    @NonNull
    public Flux<DataBuffer> getBody() {
        return Flux.empty();
    }
}
