package io.agileintelligence.ppmtool.validator;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;

@Component
public class ProjectTaskValidator implements Validator {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public boolean supports(Class<?> aClass) {
        return ProjectTask.class.equals(aClass);
    }

    @Override
    public void validate(Object object, Errors errors) {
        ProjectTask projectTask = (ProjectTask) object;
        String projectIdentifier = projectTask.getProjectIdentifier();
        if (projectIdentifier != null) {
            Project project = projectRepository.findByProjectIdentifier(projectTask.getProjectIdentifier());

            if (project != null) {
                Date dueDate = projectTask.getDueDate();
                Date projectEndDate = project.getEnd_date();
                Date projectStartDate = project.getStart_date();
                if (dueDate != null && (dueDate.after(projectEndDate) || dueDate.before(projectStartDate))) {
                    errors.rejectValue("dueDate", "DeadlineExceeded",
                            "Selected Due Date is out of the project timeline("
                                    + new SimpleDateFormat("dd-MM-yyyy").format(projectStartDate) + " to "
                                    + new SimpleDateFormat("dd-MM-yyyy").format(projectEndDate) + ")");
                }
            }

        }
    }

}