package io.agileintelligence.ppmtool.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidAppMailDetailsException extends RuntimeException {

    public InvalidAppMailDetailsException(String message) {
        super(message);
    }

}
