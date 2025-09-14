package com.scgm.customers.exceptions.city;

import java.util.List;

public class CityValidationException extends RuntimeException {

    private List<String> errors;

    public CityValidationException(String message) {
        super(message);
        this.errors = List.of(message);
    }

    public CityValidationException(String message, Throwable cause) {
        super(message, cause);
        this.errors = List.of(message);
    }

    public CityValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
