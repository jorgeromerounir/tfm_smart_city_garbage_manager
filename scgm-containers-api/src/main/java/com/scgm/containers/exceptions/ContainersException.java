package com.scgm.containers.exceptions;

public class ContainersException extends RuntimeException {

    public ContainersException(String message) {
        super(message);
    }

    public ContainersException(String message, Throwable cause) {
        super(message, cause);
    }

}
