package com.scgm.routes.exceptions;

public class TruckNotFoundException extends RuntimeException {

    public TruckNotFoundException(String truckId) {
        super("Truck not found with ID: " + truckId);
    }
}