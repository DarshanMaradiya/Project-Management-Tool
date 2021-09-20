package io.agileintelligence.ppmtool.validator;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import io.agileintelligence.ppmtool.domain.ResetPasswordRequest;

import java.util.regex.*;

@Component
public class ResetPasswordRequestValidator implements Validator {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public boolean supports(Class<?> aClass) {
        return ResetPasswordRequest.class.equals(aClass);
    }

    @Override
    public void validate(Object object, Errors errors) {
        System.out.println(">>>>>>>>> reached 3.1");
        ResetPasswordRequest request = (ResetPasswordRequest) object;
        System.out.println(">>>>>>>>> reached 3.2");
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();
        String confirmNewPassword = request.getConfirmNewPassword();
        String databaseHashedPassword = request.getDatabaseHashedPassword();

        System.out.println(currentPassword + "\n" + newPassword + "\n" + confirmNewPassword + "\n" + databaseHashedPassword);
        System.out.println(">>>>>>>>> reached 3.3");
        if (currentPassword == null || currentPassword == "") {
            errors.rejectValue("currentPassword", "NotNull", "Current Password field is required");
            if (newPassword == null || newPassword == "") {
                errors.rejectValue("newPassword", "NotNull", "New Password field is required");
            }

            if (confirmNewPassword == null || confirmNewPassword == "") {
                errors.rejectValue("confirmNewPassword", "NotNull", "Confirm New Password field is required");
            }
            return;
        }
        System.out.println(">>>>>>>>> reached 3.4");

        if (newPassword == null || newPassword == "") {
            errors.rejectValue("newPassword", "NotNull", "New Password field is required");
            if (confirmNewPassword == null || confirmNewPassword == "") {
                errors.rejectValue("confirmNewPassword", "NotNull", "Confirm New Password field is required");
            }
            return;
        }
        System.out.println(">>>>>>>>> reached 3.5");

        if (confirmNewPassword == null || confirmNewPassword == "") {
            errors.rejectValue("confirmNewPassword", "NotNull", "Confirm New Password field is required");
            return;
        }

        System.out.println(">>>>>>>>> reached 3.6");

        // check if current password is valid
        if (!bCryptPasswordEncoder.matches(currentPassword, databaseHashedPassword)) {
            errors.rejectValue("currentPassword", "Incorrect", "Wrong Password");
            return;
        }

        System.out.println(">>>>>>>>> reached 3.7");

        // Password Validation
        if (currentPassword.equals(newPassword)) {
            errors.rejectValue("newPassword", "Incorrect", "The new password is same as current password");
            return;
        }

        if (newPassword.length() < 8 || newPassword.length() > 50) {
            errors.rejectValue("newPassword", "Length", "Password must be at least 8 characters");
            return;
        }

        System.out.println(">>>>>>>>> reached 3.8");

        if (!doesFullFillCriteria(newPassword)) {
            errors.rejectValue("newPassword", "Criteria",
                    "Password must contain at least a digit, a special character, a lowercase and an uppercase character and not white spaces");
            return;
        }

        System.out.println(">>>>>>>>> reached 3.9");
        if (!newPassword.equals(confirmNewPassword)) {
            errors.rejectValue("confirmPassword", "Match", "Passwords must match");
            return;
        }
        System.out.println(">>>>>>>>> reached 3.95");
    }
    
    private static boolean doesFullFillCriteria(String password) {

        // Regex to check valid password.
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>])(?=\\S+$).{8,}$";

        // Compile the ReGex
        Pattern p = Pattern.compile(regex);

        // If the password is empty
        // return false
        if (password == null) {
            return false;
        }

        // Pattern class contains matcher() method
        // to find matching between given password
        // and regular expression.
        Matcher m = p.matcher(password);

        // Return if the password
        // matched the ReGex
        return m.matches();
    }
}
