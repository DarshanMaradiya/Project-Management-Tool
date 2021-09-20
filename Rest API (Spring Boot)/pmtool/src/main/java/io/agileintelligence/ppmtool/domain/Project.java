package io.agileintelligence.ppmtool.domain;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Project name is required")
    private String projectName;
    // @NotBlank(message = "Project Identifier is required")
    // @Size(min = 4, max = 5, message = "Please use 4-5 characters")
    @Column(updatable = false, unique = true)
    private String projectIdentifier;
    @NotBlank(message = "Project description is required")
    private String description;
    @NotNull(message = "Start date is Required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date start_date;
    @NotNull(message = "Estimated End date is Required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date end_date;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(updatable = false)
    private Date created_At;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updated_At;

    // Eager => when we load a project object
    // then the backlog information is readily available
    // CascadeType.ALL => Project is owning side, project is deleted
    // then this backlog will be deleted
    // mappedBy = "project" => In backlog class "project" is the attributename to be
    // mapped
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "project")
    // something will be there in child side of relationship
    // to avoid some recursive problem in relationship
    @JsonIgnore
    private Backlog backlog;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "team_id", referencedColumnName = "id")
    @JsonIgnore
    private Team team;

    private String projectLeader;

    @PrePersist
    protected void onCreate() {
        this.created_At = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated_At = new Date();
    }

    public Project() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectIdentifier() {
        return projectIdentifier;
    }

    public void setProjectIdentifier(String projectIdentifier) {
        this.projectIdentifier = projectIdentifier;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public Date getCreated_At() {
        return created_At;
    }

    public void setCreated_At(Date created_At) {
        this.created_At = created_At;
    }

    public Date getUpdated_At() {
        return updated_At;
    }

    public void setUpdated_At(Date updated_At) {
        this.updated_At = updated_At;
    }

    public Backlog getBacklog() {
        return backlog;
    }

    public void setBacklog(Backlog backlog) {
        this.backlog = backlog;
    }

    public String getProjectLeader() {
        return projectLeader;
    }

    public void setProjectLeader(String projectLeader) {
        this.projectLeader = projectLeader;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Project(Long id, @NotBlank(message = "Project name is required") String projectName,
            @NotBlank(message = "Project Identifier is required") @Size(min = 4, max = 5, message = "Please use 4-5 characters") String projectIdentifier,
            @NotBlank(message = "Project description is required") String description, Date start_date, Date end_date,
            Date created_At, Date updated_At, Backlog backlog, Team team, String projectLeader) {
        this.id = id;
        this.projectName = projectName;
        this.projectIdentifier = projectIdentifier;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.created_At = created_At;
        this.updated_At = updated_At;
        this.backlog = backlog;
        this.team = team;
        this.projectLeader = projectLeader;
    }

}
