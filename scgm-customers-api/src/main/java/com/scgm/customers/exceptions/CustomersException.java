package com.scgm.customers.exceptions;

public class CustomersException extends RuntimeException {

    public CustomersException(String message) {
        super(message);
    }

    public CustomersException(String message, Throwable cause) {
        super(message, cause);
    }

}
