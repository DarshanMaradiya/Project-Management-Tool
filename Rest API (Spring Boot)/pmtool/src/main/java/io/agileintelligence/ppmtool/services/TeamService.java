package io.agileintelligence.ppmtool.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.domain.TeamMember;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.exceptions.IlleagalAccessException;
import io.agileintelligence.ppmtool.exceptions.TeamMemberNotFoundException;
import io.agileintelligence.ppmtool.exceptions.TeamNotFoundException;
import io.agileintelligence.ppmtool.exceptions.UserNotFoundException;
import io.agileintelligence.ppmtool.exceptions.UsernameAlreadyExistException;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import io.agileintelligence.ppmtool.repositories.ProjectTaskRepository;
import io.agileintelligence.ppmtool.repositories.TeamMemberRepository;
import io.agileintelligence.ppmtool.repositories.TeamRepository;

@Service
public class TeamService {
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectTaskService projectTaskService;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private UserService userService;

    public Team saveOrUpdateTeam(Team team, String username) {
        if (team.getId() != null && teamRepository.getTeamById(team.getId()) == null) {
            throw new TeamNotFoundException("Team with id '" + team.getId() + "' doesn't exist");
        }

        User user = userService.getUserByUsername(username);
        team.setTeamLeader(user);

        team = teamRepository.save(team);
        return team;
    }

    public Team getTeamById(Long team_id, String username) {
        Team team = teamRepository.getTeamById(team_id);
        if (team == null) {
            throw new TeamNotFoundException("Team with id '" + team_id + "' doesn't exist");
        }

        if (!isInTeam(team, username)) {
            throw new TeamNotFoundException("Team with id '" + team_id + "' not found in your account");
        }

        return team;
    }

    public boolean isInTeam(Team team, String username) {
        boolean isTeamLeader = username.equals(team.getTeamLeader().getUsername());
        if (isTeamLeader)
            return true;

        TeamMember existingMember = teamMemberRepository.getByTeamAndUserUsername(team, username);
        if (existingMember == null)
            return false;

        return true;
    }

    public Team addTeamMember(Long team_id, String teamMemberUsername, String username) {

        Team team = this.getTeamById(team_id, username);
        if (!team.getTeamLeader().getUsername().equals(username)) {
            throw new IlleagalAccessException("Team member with username '" + username
                    + "' doesn't have access to modify Team members in team '" + team.getTeamName() + "'");
        }

        User user = userService.getUserByUsername(teamMemberUsername);
        TeamMember newTeamMember = new TeamMember(user, team);
        boolean added = team.getTeamMembers().add(newTeamMember);
        if (!added) {
            throw new UsernameAlreadyExistException(
                    "User with '" + teamMemberUsername + "' already exists in team '" + team.getTeamName() + "'");
        }

        teamRepository.save(team);

        return team;
    }

    public Team addTeamMembers(Long team_id, List<String> teamMemberUsernames, String username) {
        if (teamMemberUsernames == null) {
            // #Improvement: Bad data exception
            throw new UserNotFoundException("The list of Team Members' Usernames is null");
        }
        Team team = this.getTeamById(team_id, username);
        if (!team.getTeamLeader().getUsername().equals(username)) {
            throw new IlleagalAccessException("Team member with username '" + username
                    + "' doesn't have access to modify Team members in team '" + team.getTeamName() + "'");
        }

        teamMemberUsernames.forEach(member -> {
            User user = userService.getUserByUsername(member);
            TeamMember newTeamMember = new TeamMember(user, team);
            boolean added = team.getTeamMembers().add(newTeamMember);
            if (!added) {
                throw new UsernameAlreadyExistException(
                        "User with '" + member + "' already exists in team '" + team.getTeamName() + "'");
            }
        });

        teamRepository.save(team);
        return team;
    }

    public Team updateTeamMembers(Long team_id, List<String> teamMemberUsernames, String username) {
        if (teamMemberUsernames == null) {
            // #Improvement: Bad data exception
            throw new UserNotFoundException("The list of Team Members' Usernames is null");
        }
        Team team = this.getTeamById(team_id, username);
        if (!team.getTeamLeader().getUsername().equals(username)) {
            throw new IlleagalAccessException("Team member with username '" + username
                    + "' doesn't have access to modify Team members in team '" + team.getTeamName() + "'");
        }

        List<TeamMember> updatedTeamMembers = new ArrayList<TeamMember>();
        teamMemberUsernames.forEach(member -> {
            TeamMember existingMember = teamMemberRepository.getByTeamAndUserUsername(team, member);
            if (existingMember != null) {
                updatedTeamMembers.add(existingMember);
            } else {
                User user = userService.getUserByUsername(member);
                TeamMember newTeamMember = new TeamMember(user, team);
                updatedTeamMembers.add(newTeamMember);
            }
        });

        team.getTeamMembers().clear();
        team.getTeamMembers().addAll(updatedTeamMembers);

        teamRepository.save(team);
        return team;
    }

    public Team deleteTeamMember(Long team_id, String teamMemberUsername, String username) {
        Team team = this.getTeamById(team_id, username);
        if (!team.getTeamLeader().getUsername().equals(username)) {
            throw new IlleagalAccessException("Team member with username '" + username
                    + "' doesn't have access to modify Team members in team '" + team.getTeamName() + "'");
        }

        TeamMember teamMember = teamMemberRepository.getByTeamAndUserUsername(team, teamMemberUsername);

        if (teamMember == null) {
            throw new UserNotFoundException("Team member with username '" + teamMemberUsername + "' not found in team '"
                    + team.getTeamName() + "'");
        }
        team.getTeamMembers().remove(teamMember);

        teamRepository.save(team);
        return team;
    }

    // Won't work until associated project exists due to @OneToOne relationship
    public void deleteTeam(Long team_id, String username) {
        Team team = this.getTeamById(team_id, username);
        if (!team.getTeamLeader().getUsername().equals(username)) {
            throw new IlleagalAccessException("Team member with username '" + username
                    + "' doesn't have access to modify Team members in team '" + team.getTeamName() + "'");
        }
        teamRepository.delete(team);
    }

    public ProjectTask assignProjectTaskToTeamMember(String projectIdentifier, String projectSequence,
            String teamMemberUsername, String username) {
        ProjectTask projectTask = projectTaskService.findProjectTaskByProjectSequence(projectIdentifier,
                projectSequence, username);
        Project project = projectService.findProjectByIdentifier(projectIdentifier, username);

        Team team = project.getTeam();
        TeamMember assignee = teamMemberRepository.getByTeamAndUserUsername(team, teamMemberUsername);
        if (assignee == null) {
            throw new TeamMemberNotFoundException(
                    "Team Member with username '" + teamMemberUsername + "' is not found");
        }

        projectTask.setAssignee(assignee);
        // teamMemberRepository.save(assignee);

        projectTask = projectTaskRepository.save(projectTask);
        return projectTask;
    }
}
