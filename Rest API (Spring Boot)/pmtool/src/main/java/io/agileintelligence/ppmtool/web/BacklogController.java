package io.agileintelligence.ppmtool.web;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

import com.nimbusds.oauth2.sdk.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
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
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.domain.TeamMember;
import io.agileintelligence.ppmtool.security.CurrentUser;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.ProjectTaskService;
import io.agileintelligence.ppmtool.validator.ProjectTaskValidator;

@RestController
@RequestMapping("/api/backlog")
@CrossOrigin
public class BacklogController {
    @Autowired
    private ProjectTaskValidator projectTaskValidator;

    @Autowired
    private ProjectTaskService projectTaskService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("/{backlog_id}")
    public ResponseEntity<?> addProjectTaskToBacklog(@Valid @RequestBody ProjectTask projectTask, BindingResult result,
            @PathVariable String backlog_id, @CurrentUser UserPrincipal principal) {

        projectTaskValidator.validate(projectTask, result);
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        if (errorMap != null)
            return errorMap;

        ProjectTask projectTask1 = projectTaskService.addProjectTask(backlog_id, projectTask, principal.getName());

        return new ResponseEntity<ProjectTask>(projectTask1, HttpStatus.CREATED);
    }

    @GetMapping("/{backlog_id}")
    public Iterable<ProjectTask> getProjectBacklog(@PathVariable String backlog_id, @CurrentUser UserPrincipal principal) {
        return projectTaskService.findBacklogById(backlog_id, principal.getName());
    }

    @GetMapping("/{backlog_id}/{projectTask_id}")
    public ResponseEntity<?> getProjectTask(@PathVariable String backlog_id, @PathVariable String projectTask_id,
            Principal principal) {
        ProjectTask projectTask = projectTaskService.findProjectTaskByProjectSequence(backlog_id, projectTask_id,
                principal.getName());
        return new ResponseEntity<ProjectTask>(projectTask, HttpStatus.OK);
    }

    @PutMapping("/{backlog_id}")
    public ResponseEntity<?> updateProjectTask(@Valid @RequestBody ProjectTask projectTask, BindingResult result,
            @PathVariable String backlog_id, @CurrentUser UserPrincipal principal) {

        projectTaskValidator.validate(projectTask, result);
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        if (errorMap != null)
            return errorMap;

        ProjectTask updatedTask = projectTaskService.updateByProjectSequenceAndBacklogId(projectTask, backlog_id,
                principal.getName());

        return new ResponseEntity<ProjectTask>(updatedTask, HttpStatus.OK);
    }

    @DeleteMapping("/{backlog_id}/{projectTask_id}")
    public ResponseEntity<?> deleteProjectTask(@PathVariable String backlog_id, @PathVariable String projectTask_id,
            Principal principal) {
        projectTaskService.deleteProjectTaskByProjectSequenceAndBacklogId(backlog_id, projectTask_id,
                principal.getName());

        return new ResponseEntity<String>("Project Task " + projectTask_id + " was deleted successfully",
                HttpStatus.OK);
    }

    @GetMapping("/project_tasks")
    public ResponseEntity<?> getProjectTasks(@CurrentUser UserPrincipal principal) {
        List<ProjectTask> project_tasks = projectTaskService.getProjectTasksByUsername(principal.getName());
        return new ResponseEntity<List<ProjectTask>>(project_tasks, HttpStatus.OK);
    }

    @GetMapping("/dependecies/{backlog_id}/{projectSequence}")
    public ResponseEntity<?> getDependencies(@PathVariable String backlog_id, @PathVariable String projectSequence,
            @CurrentUser UserPrincipal principal) {
        List<ProjectTask> project_tasks = projectTaskService.getPreRequisiteTasks(backlog_id, projectSequence,
                principal.getName());
        return new ResponseEntity<List<ProjectTask>>(project_tasks, HttpStatus.OK);
    }

    @PostMapping("/dependecies/{backlog_id}/{projectSequence}")
    public ResponseEntity<?> updateDependencies(@PathVariable String backlog_id, @PathVariable String projectSequence,
            @RequestBody List<ProjectTask> preRequisiteTasks, @CurrentUser UserPrincipal principal) {
        ProjectTask projectTask = projectTaskService.setPreRequisiteTasks(backlog_id, projectSequence,
                preRequisiteTasks, principal.getName());
        return new ResponseEntity<ProjectTask>(projectTask, HttpStatus.OK);
    }

    @GetMapping("/approve/{backlog_id}/{projectSequence}/{approval}")
    public ResponseEntity<?> approveTask(@PathVariable String backlog_id, @PathVariable String projectSequence, @PathVariable boolean approval,
            @CurrentUser UserPrincipal principal) {
        ProjectTask project_task = projectTaskService.changeApprovalOfProjectTask(backlog_id, projectSequence, approval,
                principal.getName());
        return new ResponseEntity<ProjectTask>(project_task, HttpStatus.OK);
    }

    // #Un-organized: creating an endpoint for Assignee team member to update the projecttask status
    @PutMapping("/status/{backlog_id}/{projectSequence}/{status}")
    public ResponseEntity<?> approveTask(@PathVariable String backlog_id, @PathVariable String projectSequence, @PathVariable String status,
            @CurrentUser UserPrincipal principal) {
        ProjectTask project_task = projectTaskService.changeTaskStatus(backlog_id, projectSequence, status,
                principal.getName());
        return new ResponseEntity<ProjectTask>(project_task, HttpStatus.OK);
    }


}
