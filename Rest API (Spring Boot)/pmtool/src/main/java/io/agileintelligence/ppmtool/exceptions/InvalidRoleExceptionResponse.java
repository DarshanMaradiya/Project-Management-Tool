package io.agileintelligence.ppmtool.exceptions;

public class InvalidRoleExceptionResponse {
    private String invalidRole;

    public InvalidRoleExceptionResponse(String invalidRole) {
        this.invalidRole = invalidRole;
    }

    public String getInvalidRole() {
        return invalidRole;
    }

    public void setInvalidRole(String invalidRole) {
        this.invalidRole = invalidRole;
    }
    
}
