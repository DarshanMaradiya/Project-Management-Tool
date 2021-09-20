package io.agileintelligence.ppmtool.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ProjectTask {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(updatable = false, unique = true)
    private String projectSequence;
    @NotBlank(message = "Please include a project summary")
    private String summary;
    private String acceptanceCriteria;
    private String status;
    private Integer priority;
    @NotNull(message = "Due Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dueDate;

    // ManyToOne with backlog
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "backlog_id", updatable = false, nullable = false)
    @JsonIgnore
    private Backlog backlog;

    @Column(updatable = false)
    private String projectIdentifier;

    @Column(updatable = false)
    private String projectName;

    private boolean approved = false;
    private boolean available = true;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
        name = "task_dependecies",
        joinColumns = @JoinColumn(name = "base_task", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "pre_requisite_task", referencedColumnName = "id")

    )
    private List<ProjectTask> dependecies = new ArrayList<ProjectTask>();

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date completionDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date approvalDate;

    @ManyToOne
    @JoinColumn(name = "assignee_id", referencedColumnName = "id")
    private TeamMember assignee;

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }

    public Date getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(Date approvalDate) {
        this.approvalDate = approvalDate;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public List<ProjectTask> getDependecies() {
        return dependecies;
    }

    public void setDependecies(List<ProjectTask> dependecies) {
        this.dependecies = dependecies;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    private Date create_At;
    private Date update_At;

    @PrePersist
    protected void onCreate() {
        this.create_At = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.update_At = new Date();
    }

    public ProjectTask() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectSequence() {
        return projectSequence;
    }

    public void setProjectSequence(String projectSequence) {
        this.projectSequence = projectSequence;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(String acceptanceCriteria) {
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getProjectIdentifier() {
        return projectIdentifier;
    }

    public void setProjectIdentifier(String projectIdentifier) {
        this.projectIdentifier = projectIdentifier;
    }

    public Date getCreate_At() {
        return create_At;
    }

    public void setCreate_At(Date create_At) {
        this.create_At = create_At;
    }

    public Date getUpdate_At() {
        return update_At;
    }

    public void setUpdate_At(Date update_At) {
        this.update_At = update_At;
    }

    @Override
    public String toString() {
        return "ProjectTask [acceptanceCriteria=" + acceptanceCriteria + ", assignee=" + assignee + ", backlog="
                + backlog + ", create_At=" + create_At + ", dueDate=" + dueDate + ", id=" + id + ", priority="
                + priority + ", projectIdentifier=" + projectIdentifier + ", projectSequence=" + projectSequence
                + ", status=" + status + ", summary=" + summary + ", update_At=" + update_At + "]";
    }

    public Backlog getBacklog() {
        return backlog;
    }

    public void setBacklog(Backlog backlog) {
        this.backlog = backlog;
    }

    public ProjectTask(Long id, String projectSequence,
            @NotBlank(message = "Please include a project summary") String summary, String acceptanceCriteria,
            String status, Integer priority, @NotNull(message = "Due Date is required") Date dueDate, Backlog backlog,
            String projectIdentifier, TeamMember assignee, Date create_At, Date update_At) {
        this.id = id;
        this.projectSequence = projectSequence;
        this.summary = summary;
        this.acceptanceCriteria = acceptanceCriteria;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.backlog = backlog;
        this.projectIdentifier = projectIdentifier;
        this.assignee = assignee;
        this.create_At = create_At;
        this.update_At = update_At;
    }

    public TeamMember getAssignee() {
        return assignee;
    }

    public void setAssignee(TeamMember assignee) {
        this.assignee = assignee;
    }

}
