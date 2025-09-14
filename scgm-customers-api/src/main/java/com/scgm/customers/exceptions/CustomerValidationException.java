package com.scgm.customers.exceptions;

import java.util.List;

public class CustomerValidationException extends RuntimeException {

    private List<String> errors;

    public CustomerValidationException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public CustomerValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of(message);
    }

    public CustomerValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
