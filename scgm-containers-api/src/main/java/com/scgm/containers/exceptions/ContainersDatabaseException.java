package com.scgm.containers.exceptions;

public class ContainersDatabaseException extends RuntimeException {

    public ContainersDatabaseException(String message) {
        super(message);
    }

    public ContainersDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
