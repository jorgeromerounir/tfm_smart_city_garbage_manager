package com.scgm.routes.exceptions;

public class BookDatabaseException extends RuntimeException {

    public BookDatabaseException(String message) {
        super(message);
    }

    public BookDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
