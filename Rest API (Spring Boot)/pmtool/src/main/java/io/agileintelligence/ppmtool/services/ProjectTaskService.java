package io.agileintelligence.ppmtool.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.Backlog;
import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.domain.TeamMember;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.exceptions.ProjectTaskNotFoundException;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import io.agileintelligence.ppmtool.repositories.ProjectTaskRepository;
import io.agileintelligence.ppmtool.repositories.TeamMemberRepository;

@Service
public class ProjectTaskService {

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private UserService userService;

    public ProjectTask addProjectTask(String projectIdentifier, ProjectTask projectTask, String username) {

        // Exceptions: Project not found
        Project project = projectService.findProjectByIdentifier(projectIdentifier, username);

        // All ProjectTasks belongs to a backlog of a specific project for sure
        // Backlog backlog =
        // backlogRepository.findByProjectIdentifier(projectIdentifier);
        Backlog backlog = project.getBacklog();

        if (projectTask.getId() != null) {
            // throw new WrongRequestMethodException("Wrong Request Method is used to update
            // the project task");

        }
        // Set the backlog to a projectTask
        projectTask.setBacklog(backlog);
        // We want our project sequence to be like this: IDPRO-1, IDPRO-2, ..., 100 101
        Integer BacklogSequence = backlog.getPTSequence();
        // If we delete IDPRO-2 then next assignment should be next id in sequence,
        // but not IDPRO-2 for sure
        // Update the backlog SEQUENCE
        backlog.setPTSequence(++BacklogSequence);

        // Add Sequence to Project Task
        projectTask.setProjectSequence(projectIdentifier + "-" + BacklogSequence);
        projectTask.setProjectIdentifier(projectIdentifier);
        projectTask.setProjectName(project.getProjectName());

        // INTIAL priority when priority is null
        if (projectTask.getPriority() == null || projectTask.getPriority() == 0) {
            // in the future we need to remove the comment
            projectTask.setPriority(3); // Low priority
        }
        // INTIAL status when status is null
        if (projectTask.getStatus() == "" || projectTask.getStatus() == null) {
            projectTask.setStatus("TO_DO");
        }
        projectTask.setDependecies(new ArrayList<ProjectTask>());
        projectTask.setAvailable(true);
        return projectTaskRepository.save(projectTask);
    }

    public Iterable<ProjectTask> findBacklogById(String backlog_id, String username) {
        Project project = projectService.findProjectByIdentifier(backlog_id, username);

        return projectTaskRepository.findByProjectIdentifierOrderByPriority(backlog_id);
    }

    public ProjectTask findProjectTaskByProjectSequence(String projectIdentifier, String projectSequence,
            String username) {
        // Make sure we are searching on the backlog exists
        Project project = projectService.findProjectByIdentifier(projectIdentifier, username);

        Backlog backlog = project.getBacklog();

        // make sure task exists
        // make sure the backlog/projectId in the path correspond to the right project
        ProjectTask projectTask = projectTaskRepository.findByProjectSequenceAndBacklog(projectSequence, backlog);

        if (projectTask == null) {
            throw new ProjectTaskNotFoundException(
                    "Project task " + projectSequence + " does not exist in project " + projectIdentifier);
        }
        return projectTask;
    }

    public ProjectTask updateByProjectSequenceAndBacklogId(ProjectTask updatedTask, String projectIdentifier,
            String username) {
        if (updatedTask.getId() == null) {
            throw new ProjectTaskNotFoundException("Project task Id can't be null");
        }
        Project project = projectService.findProjectByIdentifier(projectIdentifier, username);

        // Find existing project task
        ProjectTask projectTask = findProjectTaskByProjectSequence(project.getProjectIdentifier(),
                updatedTask.getProjectSequence(), username);
        if (projectTask == null || !projectTask.getId().equals(updatedTask.getId())) {
            throw new ProjectTaskNotFoundException("Invalid Project task Id");
        }
        updatedTask.setDependecies(projectTask.getDependecies());
        boolean available = true;
        for(ProjectTask task: updatedTask.getDependecies()) {
            available = available && task.isApproved();
            if (available == false)
                break;
        }
        updatedTask.setAvailable(available);
        // Replace it with updated task
        // save update
        return projectTaskRepository.save(updatedTask);
    }

    public void deleteProjectTaskByProjectSequenceAndBacklogId(String backlog_id, String projectSequence,
            String username) {
        // Find existing project task
        ProjectTask projectTask = findProjectTaskByProjectSequence(backlog_id, projectSequence, username);
        // delete the task
        System.out.println("Deleting");
        projectTaskRepository.delete(projectTask);
    }

    public List<ProjectTask> getProjectTasksByUsername(String username) {
        User user = userService.getUserByUsername(username);
        return projectTaskRepository.findAllProjectTasksByAssigneeUserUsername(username);
    }

    public List<ProjectTask> getPreRequisiteTasks(String projectIdentifier, String projectSequence, String username) {
        ProjectTask projectTask = findProjectTaskByProjectSequence(projectIdentifier, projectSequence, username);
        return projectTask.getDependecies();
    }

	public ProjectTask setPreRequisiteTasks(String projectIdentifier, String projectSequence,
            List<ProjectTask> preRequisiteTasks, String username) {
        ProjectTask projectTask = findProjectTaskByProjectSequence(projectIdentifier, projectSequence, username);
        projectTask.setDependecies(preRequisiteTasks);
        boolean available = true;
        for(ProjectTask task: projectTask.getDependecies()) {
            available = available && task.isApproved();
            if (available == false)
                break;
        }
        projectTask.setAvailable(available);
        projectTask = projectTaskRepository.save(projectTask);
        return projectTask;
	}

    public ProjectTask changeApprovalOfProjectTask(String projectIdentifier, String projectSequence, boolean approval, String username) {
        ProjectTask projectTask = findProjectTaskByProjectSequence(projectIdentifier, projectSequence, username);
        projectTask.setApproved(approval);
        if(approval) projectTask.setApprovalDate(new Date());
        else projectTask.setApprovalDate(null);
        projectTask = projectTaskRepository.save(projectTask);
        List<ProjectTask> dependentTasks = projectTaskRepository
                .findAllProjectTasksByDependeciesContaining(projectTask);

        for (ProjectTask task : dependentTasks) {
            boolean available = true;
            for (ProjectTask t : task.getDependecies())
                available = available && t.isApproved();
            task.setAvailable(available);
            projectTaskRepository.save(task);
        }
        return projectTask;
    }

    public ProjectTask changeTaskStatus(String backlog_id, String projectSequence, String status, String username) {
        Project project = projectRepository.findByProjectIdentifier(backlog_id);
        ProjectTask projectTask = projectTaskRepository.findByProjectSequenceAndBacklog(projectSequence,
                project.getBacklog());
        if (!projectTask.getAssignee().getUser().getUsername().equals(username)) {
            throw new ProjectTaskNotFoundException(
                    "The project task '" + projectSequence + "' is not assigned to " + username);
        }
        projectTask.setStatus(status);
        if (status.equals("DONE"))
            projectTask.setCompletionDate(new Date());
        else projectTask.setCompletionDate(null);
        projectTask = projectTaskRepository.save(projectTask);
        return projectTask;
    }


}
