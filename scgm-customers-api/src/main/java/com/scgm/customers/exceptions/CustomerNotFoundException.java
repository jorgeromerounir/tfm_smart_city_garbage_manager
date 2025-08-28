package com.scgm.customers.exceptions;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Long customerId) {
        super(String.format("Customer not found, id: %s", customerId));
    }
    
}
