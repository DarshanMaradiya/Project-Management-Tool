package io.agileintelligence.ppmtool.exceptions;

public class TeamMemberNotFoundExceptionResponse {
    private String TeamMemberNotFoundException;

    public String getTeamMemberNotFoundException() {
        return TeamMemberNotFoundException;
    }

    public void setTeamMemberNotFoundException(String teamMemberNotFoundException) {
        TeamMemberNotFoundException = teamMemberNotFoundException;
    }

    public TeamMemberNotFoundExceptionResponse(String teamMemberNotFoundException) {
        TeamMemberNotFoundException = teamMemberNotFoundException;
    }

}
