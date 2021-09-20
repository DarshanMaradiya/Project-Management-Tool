package io.agileintelligence.ppmtool.web;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.ResetPasswordRequest;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.payload.JWTLoginSuccessResponse;
import io.agileintelligence.ppmtool.payload.LoginRequest;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import io.agileintelligence.ppmtool.security.CurrentUser;
import io.agileintelligence.ppmtool.security.JwtTokenProvider;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.UserService;
import io.agileintelligence.ppmtool.validator.ResetPasswordRequestValidator;
import io.agileintelligence.ppmtool.validator.UserValidator;
import static io.agileintelligence.ppmtool.security.SecurityConstants.TOKEN_PREFIX;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private ResetPasswordRequestValidator resetPasswordRequestValidator;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        // validate passwords match
        userValidator.validate(user, result);

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        if (errorMap != null)
            return errorMap;
        // ---------------------------------------------------------#SIGNUP_WITH_LOGIN
        String password = user.getPassword();
        // ---------------------------------------------------------

        User newUser = userService.saveUser(user);
        // ---------------------------------------------------------#SIGNUP_WITH_LOGIN
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = TOKEN_PREFIX + tokenProvider.generateToken(authentication);
        
        return ResponseEntity.ok(new JWTLoginSuccessResponse(true, jwt));
        // ----------------------------------------------------------
        // return new ResponseEntity<User>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult result) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null)
            return errorMap;
            System.out.println(">>>>>>>>>>>>> reached1");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
                System.out.println(">>>>>>>>>>>>>> reached2" + authentication.getName());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = TOKEN_PREFIX + tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JWTLoginSuccessResponse(true, jwt));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> searchUser(@PathVariable String keyword, @CurrentUser UserPrincipal principal) {
        Set<User> users = userService.getUsersByKeyword(keyword, principal.getName());

        return new ResponseEntity<Set<User>>(users, HttpStatus.OK);
    }

    // Just for testing, to be removed
    @PostMapping("/register/all")
    public ResponseEntity<?> registerAllUsers(@Valid @RequestBody List<User> users, BindingResult result) {
        List<User> registeredUsers = new ArrayList<User>();
        for (User user : users) {
            // validate passwords match
            userValidator.validate(user, result);

            ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

            if (errorMap != null)
                return errorMap;

            User newUser = userService.saveUser(user);

            registeredUsers.add(newUser);
        }

        return new ResponseEntity<List<User>>(registeredUsers, HttpStatus.CREATED);
    }

    @GetMapping("/login/{role}")
    public ResponseEntity<?> loginAs(@PathVariable String role, @CurrentUser UserPrincipal principal) {
        User user = userService.setRole(role, principal.getName());
        return new ResponseEntity<String>(role, HttpStatus.OK);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUsername(@CurrentUser UserPrincipal principal) {
        User user = userService.getUserByUsername(principal.getName());
        user.setEmailVerified(true);
        userRepository.save(user);
        
        String jwt = TOKEN_PREFIX + tokenProvider.generateToken(SecurityContextHolder.getContext().getAuthentication());

        return ResponseEntity.ok(new JWTLoginSuccessResponse(true, jwt));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest,
            @CurrentUser UserPrincipal principal, BindingResult result) {
        System.out.println(">>>>>>>>> reached 1");
        User user = userService.getUserByUsername(principal.getName());
        System.out.println(">>>>>>>>> reached 2");
        resetPasswordRequest.setDatabaseHashedPassword(user.getPassword());
        System.out.println(">>>>>>>>> reached 3");

        // validate passwords match
        resetPasswordRequestValidator.validate(resetPasswordRequest, result);

        System.out.println(">>>>>>>>> reached 4");

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        if (errorMap != null)
            return errorMap;

        System.out.println(">>>>>>>>> reached 5");
            
        user.setPassword(bCryptPasswordEncoder.encode(resetPasswordRequest.getNewPassword()));
        user = userRepository.save(user);
        
        System.out.println(">>>>>>>>> reached 5.5");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), resetPasswordRequest.getNewPassword()));
        System.out.println(">>>>>>>>> reached 6");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println(">>>>>>>>> reached 7");
        String jwt = TOKEN_PREFIX + tokenProvider.generateToken(authentication);
        System.out.println(">>>>>>>>> reached 8");
        
        return ResponseEntity.ok(new JWTLoginSuccessResponse(true, jwt));
    }
}