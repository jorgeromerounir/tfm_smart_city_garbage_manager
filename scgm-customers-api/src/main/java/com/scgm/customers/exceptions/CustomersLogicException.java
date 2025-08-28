package com.scgm.customers.exceptions;

public class CustomersLogicException extends RuntimeException {

    public CustomersLogicException(String message) {
        super(message);
    }

    public CustomersLogicException(String message, Throwable cause) {
        super(message, cause);
    }

}
