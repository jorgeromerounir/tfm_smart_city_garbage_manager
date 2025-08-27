package com.scgm.customers.exceptions;

import java.util.List;

public class CustomerValidationException extends RuntimeException {

    public CustomerValidationException(String message) {
        super(message);
    }

    public CustomerValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    private List<String> errors;

    public CustomerValidationException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
