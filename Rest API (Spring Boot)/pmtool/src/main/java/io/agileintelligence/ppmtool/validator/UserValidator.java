package io.agileintelligence.ppmtool.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import io.agileintelligence.ppmtool.domain.User;
import java.util.regex.*;

@Component
public class UserValidator implements Validator {

    @Override
    public boolean supports(Class<?> aClass) {
        return User.class.equals(aClass);
    }

    @Override
    public void validate(Object object, Errors errors) {
        User user = (User) object;

        // Full Name validation
        formatAndValidateFullname(user, errors);

        if (user.getPassword() == null || user.getPassword().length() == 0) {
            errors.rejectValue("password", "NotNull", "Password field is required");
            if (user.getConfirmPassword() == null || user.getConfirmPassword().length() == 0) {
                errors.rejectValue("confirmPassword", "NotNull", "Confirm Password field is required");
            }
            return;
        }

        // Password Validation
        if (user.getPassword().length() < 8 || user.getPassword().length() > 50) {
            errors.rejectValue("password", "Length", "Password must be at least 8 characters");
            return;
        }

        // if (!doesFullFillCriteria(user.getPassword())) {
        // errors.rejectValue("password", "Criteria",
        // "Password must contain at least a digit, a special character, a lowercase and an uppercase character and not white spaces");
        // return;
        // }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            errors.rejectValue("confirmPassword", "Match", "Password must match");
            return;
        }
    }

    private static void formatAndValidateFullname(User user, Errors errors) {
        StringBuffer sb = new StringBuffer();
        String fullname = user.getFullname();
        boolean makeUpper = true;

        for (char c : fullname.toCharArray()) {
            if (c == ' ') {
                if (!makeUpper)
                    sb.append(c);
                makeUpper = true;
                continue;
            }
            if (makeUpper) {
                makeUpper = false;
                if ('a' <= c && c <= 'z')
                    sb.append((char) (c - ('a' - 'A')));
                else if ('A' <= c && c <= 'Z')
                    sb.append(c);
                else {
                    errors.rejectValue("fullname", "InvalidCharacters", "Full Name should contain alphabets only1");
                    return;
                }
            } else {
                if ('A' <= c && c <= 'Z')
                    sb.append((char) (c + ('a' - 'A')));
                else if ('a' <= c && c <= 'z')
                    sb.append(c);
                else {
                    errors.rejectValue("fullname", "InvalidCharacters", "Full Name should contain alphabets only");
                }
            }
        }
        user.setFullname(sb.toString());
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
