package com.scgm.routes.exceptions;

public class RouteLogicException extends RuntimeException {

    public RouteLogicException(String message) {
        super(message);
    }

    public RouteLogicException(String message, Throwable cause) {
        super(message, cause);
    }

}