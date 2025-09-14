package com.scgm.containers.exceptions;

import java.util.List;

public class ContainerValidationException extends RuntimeException {

    private List<String> errors;

    public ContainerValidationException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public ContainerValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of(message);
    }

    public ContainerValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
