package io.agileintelligence.ppmtool.exceptions;

public class TeamNotFoundExceptionResponse {
    public String teamNotFound;

    public String getTeamNotFound() {
        return teamNotFound;
    }

    public void setTeamNotFound(String teamNotFound) {
        this.teamNotFound = teamNotFound;
    }

    public TeamNotFoundExceptionResponse(String teamNotFound) {
        this.teamNotFound = teamNotFound;
    }

}
