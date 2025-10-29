package com.scgm.routes.exceptions;

public class TrucksDatabaseException extends RuntimeException {

    public TrucksDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}