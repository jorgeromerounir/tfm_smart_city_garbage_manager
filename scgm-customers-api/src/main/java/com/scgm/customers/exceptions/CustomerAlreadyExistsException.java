package com.scgm.customers.exceptions;

public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(String isbn) {
        super(String.format("The book already exists, isbn: %s", isbn));
    }

}