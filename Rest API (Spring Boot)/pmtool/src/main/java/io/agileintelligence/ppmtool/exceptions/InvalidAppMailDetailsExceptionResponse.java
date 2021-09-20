package io.agileintelligence.ppmtool.exceptions;

public class InvalidAppMailDetailsExceptionResponse {

    private String InvalidAppMailDetails;

    public String getInvalidAppMailDetails() {
        return InvalidAppMailDetails;
    }

    public void setInvalidAppMailDetails(String invalidAppMailDetails) {
        InvalidAppMailDetails = invalidAppMailDetails;
    }

    public InvalidAppMailDetailsExceptionResponse(String invalidAppMailDetails) {
        InvalidAppMailDetails = invalidAppMailDetails;
    }

}
