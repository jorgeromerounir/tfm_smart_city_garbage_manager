package com.scgm.containers.exceptions;

public class ContainerNotFoundException extends RuntimeException {

    public ContainerNotFoundException(String containerId) {
        super(String.format("Container not found, id: %s", containerId));
    }
    
}