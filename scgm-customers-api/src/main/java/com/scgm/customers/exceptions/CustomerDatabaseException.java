package com.scgm.customers.exceptions;

public class CustomerDatabaseException extends RuntimeException {

    public CustomerDatabaseException(String message) {
        super(message);
    }

    public CustomerDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
