package com.scgm.containers.exceptions;

public class ZoneNotFoundException extends RuntimeException {

    public ZoneNotFoundException(String zoneId) {
        super("Zone not found with ID: " + zoneId);
    }
}