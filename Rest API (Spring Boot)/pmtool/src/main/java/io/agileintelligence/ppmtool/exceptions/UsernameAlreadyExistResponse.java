package io.agileintelligence.ppmtool.exceptions;

public class UsernameAlreadyExistResponse {

    private String Username;

    public UsernameAlreadyExistResponse(String username) {
        Username = username;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String username) {
        Username = username;
    }

}
