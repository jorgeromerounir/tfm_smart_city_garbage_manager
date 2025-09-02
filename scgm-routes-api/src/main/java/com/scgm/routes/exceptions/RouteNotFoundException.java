package com.scgm.routes.exceptions;

public class RouteNotFoundException extends RuntimeException {

    public RouteNotFoundException(String routeId) {
        super("Route not found with ID: " + routeId);
    }

}