package io.agileintelligence.ppmtool.web;

import java.security.Principal;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.security.CurrentUser;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.TeamService;

@RestController
@RequestMapping("/api/team")
@CrossOrigin
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("")
    public ResponseEntity<?> createNewTeam(@Valid @RequestBody Team team, BindingResult result, @CurrentUser UserPrincipal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        if (errorMap != null)
            return errorMap;

        return new ResponseEntity<Team>(teamService.saveOrUpdateTeam(team, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/{team_id}")
    public ResponseEntity<?> getTeam(@PathVariable Long team_id, @CurrentUser UserPrincipal principal) {
        return new ResponseEntity<Team>(teamService.getTeamById(team_id, principal.getName()), HttpStatus.OK);
    }

    @DeleteMapping("/{team_id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long team_id, @CurrentUser UserPrincipal principal) {
        teamService.deleteTeam(team_id, principal.getName());
        return new ResponseEntity<String>("Team with id '" + team_id + "' is deleted", HttpStatus.OK);
    }

    @PutMapping("/{team_id}")
    public ResponseEntity<?> addTeamMembers(@PathVariable Long team_id, @RequestBody List<String> teamMemberUsernames,
            @CurrentUser UserPrincipal principal) {
        return new ResponseEntity<Team>(teamService.addTeamMembers(team_id, teamMemberUsernames, principal.getName()),
                HttpStatus.CREATED);
    }

    @PostMapping("/{team_id}")
    public ResponseEntity<?> modifyTeamMembers(@PathVariable Long team_id,
            @RequestBody List<String> teamMemberUsernames, @CurrentUser UserPrincipal principal) {
        return new ResponseEntity<Team>(
                teamService.updateTeamMembers(team_id, teamMemberUsernames, principal.getName()), HttpStatus.OK);
    }

    @PutMapping("/{team_id}/{teamMemberUsername}")
    public ResponseEntity<?> addTeamMember(@PathVariable Long team_id, @PathVariable String teamMemberUsername,
            @CurrentUser UserPrincipal principal) {
        return new ResponseEntity<Team>(teamService.addTeamMember(team_id, teamMemberUsername, principal.getName()),
                HttpStatus.CREATED);
    }

    @DeleteMapping("/{team_id}/{teamMemberUsername}")
    public ResponseEntity<?> deleteTeamMember(@PathVariable Long team_id, @PathVariable String teamMemberUsername,
            @CurrentUser UserPrincipal principal) {
        return new ResponseEntity<Team>(teamService.deleteTeamMember(team_id, teamMemberUsername, principal.getName()),
                HttpStatus.CREATED);
    }

    @GetMapping("/assign")
    public ResponseEntity<?> assignProjectTask(@RequestParam(name = "bg", required = true) String backlog_id,
            @RequestParam(name = "pt", required = true) String projectTask_id,
            @RequestParam(name = "tm", required = true) String teamMemberUsername, @CurrentUser UserPrincipal principal) {
        ProjectTask projectTask = teamService.assignProjectTaskToTeamMember(backlog_id, projectTask_id,
                teamMemberUsername, principal.getName());
        return new ResponseEntity<ProjectTask>(projectTask, HttpStatus.OK);
    }

}
