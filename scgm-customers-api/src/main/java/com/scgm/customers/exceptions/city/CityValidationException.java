package com.scgm.customers.exceptions.city;

import java.util.List;

public class CityValidationException extends RuntimeException {

    public CityValidationException(String message) {
        super(message);
    }

    public CityValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    private List<String> errors;

    public CityValidationException(String message, List<String> errors) {
        super(message + (errors.isEmpty() ? "" : (":\n- " + String.join("\n- ", errors))));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}