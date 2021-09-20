package io.agileintelligence.ppmtool.validator;

import java.util.Date;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import io.agileintelligence.ppmtool.domain.Project;

@Component
public class ProjectValidator implements Validator {

    @Override
    public boolean supports(Class<?> aClass) {
        return Project.class.equals(aClass);
    }

    @Override
    public void validate(Object object, Errors errors) {
        Project project = (Project) object;
        Date startDate = project.getStart_date();
        Date endDate = project.getEnd_date();

        if (startDate != null && endDate != null && !endDate.after(startDate)) {
            errors.rejectValue("end_date", "NegativeTimeSpan", "Expected End date must be after Start date");
        }
    }
}
