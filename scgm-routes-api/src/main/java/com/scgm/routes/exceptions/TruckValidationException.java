package com.scgm.routes.exceptions;

import java.util.List;

public class TruckValidationException extends RuntimeException {

    private final List<String> errors;

    public TruckValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}