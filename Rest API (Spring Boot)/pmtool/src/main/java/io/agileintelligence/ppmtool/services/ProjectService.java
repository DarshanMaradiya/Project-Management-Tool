package io.agileintelligence.ppmtool.services;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.Backlog;
import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.exceptions.ProjectIdException;
import io.agileintelligence.ppmtool.exceptions.ProjectNotFoundException;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import io.agileintelligence.ppmtool.repositories.TeamRepository;
import io.agileintelligence.ppmtool.repositories.UserRepository;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeamRepository teamRepository;

    public Project saveOrUpdateProject(Project project, String username) {

        // If project is here for updation
        if (project.getId() != null) {
            Project existingProject = projectRepository.getProjectById(project.getId());

            // Project doesn't exist at all
            if (existingProject == null) {
                throw new ProjectNotFoundException("Project with ID: '" + project.getProjectIdentifier()
                        + "' can not be updated, because it doesn't exists");
            }
            // Project does exist
            else {
                // But Project doesn't exist in user's(leader's) account
                if (!existingProject.getProjectLeader().equals(username)) {
                    throw new ProjectNotFoundException("Project not found in your account");
                }
                // Project is in leader's account
                else {
                    // Optionally check that backlog is not changed

                    // Set Team from the existing project
                    project.setTeam(existingProject.getTeam());

                    // Save the updated details
                    projectRepository.save(project);
                    return project;
                }
            }
        }
        // Project is here for creation
        else {

            String projectId = getUniqueAlphanumericValue().toUpperCase();
            project.setProjectIdentifier(projectId);
        
            // Set the leader
            User user = userRepository.findByUsername(username);
            project.setProjectLeader(username);

            // Set new Backlog
            Backlog backlog = new Backlog();
            project.setBacklog(backlog);
            backlog.setProject(project);
            backlog.setProjectIdentifier(projectId);

            // Set new Team
            project = projectRepository.save(project);
            Team team = new Team();
            team.setProject(project);
            team.setTeamLeader(user);
            team.setTeamIdentifier(project.getProjectIdentifier());
            team.setTeamName(project.getProjectName() + " Project team");
            teamRepository.save(team);

            project.setTeam(team);
            projectRepository.save(project);
            return project;
        }
    }

    public Project findProjectByIdentifier(String projectIdentifier, String username) {
        Project project = projectRepository.findByProjectIdentifier(projectIdentifier.toUpperCase());
        if (project == null) {
            throw new ProjectIdException("Project Id '" + projectIdentifier.toUpperCase() + "' does not exist");
        }

        if (!project.getProjectLeader().equals(username)) {
            throw new ProjectNotFoundException("Project not found in your account");
        }

        return project;
    }

    public Iterable<Project> findAllProjects(String username) {
        return projectRepository.findAllByProjectLeader(username);
    }

    public void deleteProjectByIdentifier(String Identifier, String username) {
        Project project = findProjectByIdentifier(Identifier, username);

        projectRepository.delete(project);

    }

    private static String getUniqueAlphanumericValue() {
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        return (Long.toString(timestamp.getTime(), 36)
                + Long.toString((long) Math.floor(Math.random() * 1000000000), 36));
    }
}
