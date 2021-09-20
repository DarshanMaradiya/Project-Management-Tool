package io.agileintelligence.ppmtool.web;

import java.security.Principal;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.security.CurrentUser;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.ProjectService;
import io.agileintelligence.ppmtool.validator.ProjectValidator;

@RestController
@RequestMapping("/api/project")
@CrossOrigin
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectValidator projectValidator;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("")
    public ResponseEntity<?> createNewProject(@Valid @RequestBody Project project, BindingResult result,
            @CurrentUser UserPrincipal principal) {
        // ResponseEntity<?> errorMap =
        // mapValidationErrorService.MapValidationService(result);
        // if (errorMap != null)
        // return errorMap;
        projectValidator.validate(project, result);

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null)
            return errorMap;

        Project project1 = projectService.saveOrUpdateProject(project, principal.getName());
        System.out.println("reached1 ");
        System.out.println("1 >>>> " + principal.getName() + " " + (principal == null) + " " + principal.toString() + " " + principal.getUsername());
        return new ResponseEntity<Project>(project1, HttpStatus.CREATED);
    }

    @GetMapping("/{projectIdentifier}")
    public ResponseEntity<?> getProjectById(@PathVariable String projectIdentifier, @CurrentUser UserPrincipal principal) {
        Project project = projectService.findProjectByIdentifier(projectIdentifier, principal.getName());

        return new ResponseEntity<Project>(project, HttpStatus.OK);
    }

    @GetMapping("/all")
    public Iterable<Project> getAllProjects(@CurrentUser UserPrincipal principal) {
        return projectService.findAllProjects(principal.getName());
    }

    @DeleteMapping("/{projectIdentifier}")
    public ResponseEntity<String> deleteProject(@PathVariable String projectIdentifier, @CurrentUser UserPrincipal principal) {
        projectService.deleteProjectByIdentifier(projectIdentifier, principal.getName());

        return new ResponseEntity<String>("Project with id '" + projectIdentifier.toUpperCase() + "' was deleted",
                HttpStatus.OK);
    }

    @GetMapping("/team/{projectIdentifier}")
    public ResponseEntity<?> getTeamByProjectIdentifier(@PathVariable String projectIdentifier,
            @CurrentUser UserPrincipal principal) {
                System.out.println("reached ");
        System.out.println("2 >>>> " + principal.getName() + " " + (principal == null) + " " + principal.toString() + " " + principal.getUsername());
        Project project = projectService.findProjectByIdentifier(projectIdentifier, principal.getName());
        Team team = project.getTeam();
        return new ResponseEntity<Team>(team, HttpStatus.OK);
    }

}
