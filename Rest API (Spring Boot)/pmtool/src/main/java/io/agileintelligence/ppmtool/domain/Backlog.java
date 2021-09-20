package io.agileintelligence.ppmtool.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity
public class Backlog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer PTSequence = 0;
    private String projectIdentifier;

    // OneToOne with project
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToOne // (fetch = FetchType.EAGER) // FetchType.LAZY doesn't loads the relationship
              // until requested explicitly
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore // To avoid infinite recursion
    private Project project;

    // OneToMany projectTasks
    // CascadeType.REFRESH => we can delete a task beongs to the backlog,
    // it will refresh the backlog
    // orphanremoval = true => when child entity is not referenced,
    // then it removes the child entity also
    @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER, mappedBy = "backlog", orphanRemoval = true)
    private List<ProjectTask> projectTasks = new ArrayList<>();

    public Backlog() {
    }

    public Integer getPTSequence() {
        return PTSequence;
    }

    public void setPTSequence(Integer pTSequence) {
        PTSequence = pTSequence;
    }

    public String getProjectIdentifier() {
        return projectIdentifier;
    }

    public void setProjectIdentifier(String projectIdentifier) {
        this.projectIdentifier = projectIdentifier;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<ProjectTask> getProjectTasks() {
        return projectTasks;
    }

    public void setProjectTasks(List<ProjectTask> projectTasks) {
        this.projectTasks = projectTasks;
    }

}
