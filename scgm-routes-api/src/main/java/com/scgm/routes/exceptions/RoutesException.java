package com.scgm.routes.exceptions;

public class RoutesException extends RuntimeException {

    public RoutesException(String message) {
        super(message);
    }

    public RoutesException(String message, Throwable cause) {
        super(message, cause);
    }

}
