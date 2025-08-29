package com.scgm.customers.exceptions.user;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super(String.format("User not found, id: %s", userId));
    }
    
}