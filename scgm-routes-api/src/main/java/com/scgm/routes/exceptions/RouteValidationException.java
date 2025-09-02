package com.scgm.routes.exceptions;

import java.util.List;

public class RouteValidationException extends RuntimeException {

    private List<String> errors;

    public RouteValidationException(String message) {
        super(message);
        this.errors = List.of();
    }

    public RouteValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of();
    }

    public RouteValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }

}