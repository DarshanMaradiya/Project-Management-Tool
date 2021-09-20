package io.agileintelligence.ppmtool.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String teamIdentifier = "teamIdentifier";

    @OneToOne
    @JoinColumn(name = "team_leader", referencedColumnName = "id")
    private User teamLeader;

    @NotBlank(message = "Team name is required")
    private String teamName;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> teamMembers = new ArrayList<TeamMember>();

    @OneToOne(mappedBy = "team")
    @JsonIgnore
    private Project project;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getTeamLeader() {
        return teamLeader;
    }

    public void setTeamLeader(User teamLeader) {
        this.teamLeader = teamLeader;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<TeamMember> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<TeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public Team() {
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getTeamIdentifier() {
        return teamIdentifier;
    }

    public void setTeamIdentifier(String teamIdentifier) {
        this.teamIdentifier = teamIdentifier;
    }

    public Team(Long id, String teamIdentifier, User teamLeader,
            @NotBlank(message = "Team name is required") String teamName, List<TeamMember> teamMembers,
            Project project) {
        this.id = id;
        this.teamIdentifier = teamIdentifier;
        this.teamLeader = teamLeader;
        this.teamName = teamName;
        this.teamMembers = teamMembers;
        this.project = project;
    }

}
