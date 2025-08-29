package com.scgm.customers.exceptions.city;

public class CityNotFoundException extends RuntimeException {

    public CityNotFoundException(Long cityId) {
        super(String.format("City not found, id: %s", cityId));
    }
    
}