package io.agileintelligence.ppmtool.exceptions;

public class UserNotFoundExceptionResponse {
    public String userNotFound;

    public String getUserNotFound() {
        return userNotFound;
    }

    public void setUserNotFound(String UserNotFound) {
        this.userNotFound = UserNotFound;
    }

    public UserNotFoundExceptionResponse(String UserNotFound) {
        this.userNotFound = UserNotFound;
    }

}
