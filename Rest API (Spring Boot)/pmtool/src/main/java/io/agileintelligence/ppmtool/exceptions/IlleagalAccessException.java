package io.agileintelligence.ppmtool.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class IlleagalAccessException extends RuntimeException {

    public IlleagalAccessException(String message) {
        super(message);
    }

}
