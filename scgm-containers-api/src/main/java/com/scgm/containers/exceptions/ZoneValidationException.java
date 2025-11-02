package com.scgm.containers.exceptions;

import java.util.List;

public class ZoneValidationException extends RuntimeException {

    private final List<String> errors;

    public ZoneValidationException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}