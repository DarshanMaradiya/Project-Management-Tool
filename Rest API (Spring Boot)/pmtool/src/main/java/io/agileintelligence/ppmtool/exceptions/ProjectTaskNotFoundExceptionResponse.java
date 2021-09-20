package io.agileintelligence.ppmtool.exceptions;

public class ProjectTaskNotFoundExceptionResponse {
    public String projectTaskNotFound;

    public String getProjectTaskNotFound() {
        return projectTaskNotFound;
    }

    public void setProjectTaskNotFound(String projectTaskNotFound) {
        this.projectTaskNotFound = projectTaskNotFound;
    }

    public ProjectTaskNotFoundExceptionResponse(String projectTaskNotFound) {
        this.projectTaskNotFound = projectTaskNotFound;
    }

}
