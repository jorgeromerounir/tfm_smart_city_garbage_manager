package com.scgm.customers.exceptions;

import java.util.List;

public class UnauthorizedException extends RuntimeException {

    private List<String> errors;

    public UnauthorizedException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of(message);
    }

    public UnauthorizedException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
