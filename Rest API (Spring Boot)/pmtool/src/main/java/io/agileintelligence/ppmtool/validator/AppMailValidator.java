package io.agileintelligence.ppmtool.validator;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import io.agileintelligence.ppmtool.domain.AppMail;
import io.agileintelligence.ppmtool.domain.Badge;

@Component
public class AppMailValidator implements Validator {

    @Override
    public boolean supports(Class<?> aClass) {
        return AppMail.class.equals(aClass);
    }

    @Override
    public void validate(Object object, Errors errors) {
        Map<String, Object> appMailDetails = (Map<String, Object>) object;

        String message = (String) appMailDetails.get("message");
        String sender = (String) appMailDetails.get("sender");
        String receiver = (String) appMailDetails.get("receiver");

        String subject = (String) appMailDetails.get("subject");
        
        Badge badge = (Badge) appMailDetails.get("badge");
        
        Date sentTime = (Date) appMailDetails.get("sentTime");

    }
    
}
