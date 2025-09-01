package com.scgm.containers.exceptions;

public class ContainersLogicException extends RuntimeException {

    public ContainersLogicException(String message) {
        super(message);
    }

    public ContainersLogicException(String message, Throwable cause) {
        super(message, cause);
    }

}
