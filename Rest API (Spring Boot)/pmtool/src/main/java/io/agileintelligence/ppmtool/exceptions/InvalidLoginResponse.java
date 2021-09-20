package io.agileintelligence.ppmtool.exceptions;

// JSON object that we want to return on invalid login
public class InvalidLoginResponse {
    private String username;
    private String password;
    private String invalidLoginResponse;

    public InvalidLoginResponse() {
        // this.username = "Invalid Username";
        // this.password = "Invalid Password";
        this.invalidLoginResponse = "Invalid Username or Password";
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getInvalidLoginResponse() {
        return invalidLoginResponse;
    }

    public void setInvalidLoginResponse(String invalidLoginResponse) {
        this.invalidLoginResponse = invalidLoginResponse;
    }
}