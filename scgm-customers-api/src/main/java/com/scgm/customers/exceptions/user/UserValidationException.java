package com.scgm.customers.exceptions.user;

import java.util.List;

public class UserValidationException extends RuntimeException {

    private List<String> errors;

    public UserValidationException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public UserValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of(message);
    }

    public UserValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
