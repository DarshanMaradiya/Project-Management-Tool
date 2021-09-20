package io.agileintelligence.ppmtool.services;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.Inbox;
import io.agileintelligence.ppmtool.domain.Role;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.exceptions.InvalidRoleException;
import io.agileintelligence.ppmtool.exceptions.UserNotFoundException;
import io.agileintelligence.ppmtool.exceptions.UsernameAlreadyExistException;
import io.agileintelligence.ppmtool.repositories.InboxRepository;
import io.agileintelligence.ppmtool.repositories.RoleRepository;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import io.agileintelligence.ppmtool.security.UserPrincipal;

import static io.agileintelligence.ppmtool.security.SecurityConstants.DEFAULT_ROLE;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // password encoder
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private InboxRepository inboxRepository;

    public User saveUser(User newUser) {
        newUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));

        try {

            // Username has to be unique (may need exception)
            newUser.setUsername(newUser.getUsername());
            // we don't persist confirmPassword
            newUser.setConfirmPassword("");
            Set<Role> roles = newUser.getRoles();
            Role role = roleRepository.getRoleByName(DEFAULT_ROLE);
            roles.add(role);
            newUser.setRoles(roles);
            newUser = userRepository.save(newUser);
            Inbox inbox = new Inbox();
            inbox.setUser(newUser.getUsername());
            inboxRepository.save(inbox);
            return newUser;
        } catch (Exception e) {
            throw new UsernameAlreadyExistException("Username '" + newUser.getUsername() + "' already exists");
        }

    }

    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException("User with username '" + username + "' doesn't exist");
        }
        return user;
    }

    public Set<User> getUsersByKeyword(String keyword, String username) {
        // Just check whether the loggedIn user is registered or not
        User loggedInUser = getUserByUsername(username);

        Set<User> users = userRepository.findByUsernameContainingIgnoreCase(keyword);
        users.addAll(userRepository.findByFullnameContainingIgnoreCase(keyword));
        return users;
    }

    public User setRole(String roleName, String username) {
        User user = getUserByUsername(username);
        Set<Role> roles = user.getRoles();
        Role role = roleRepository.getRoleByName("ROLE_" + roleName.toUpperCase());
        if (role == null) {
            throw new InvalidRoleException("Role for '" + roleName + "' doesn't exist");
        }
        if (role.getName().equals("ROLE_MEMBER"))
            roles = roles.stream().filter(r -> !r.getName().equals("ROLE_LEADER")).collect(Collectors.toSet());
        else
            roles = roles.stream().filter(r -> !r.getName().equals("ROLE_MEMBER")).collect(Collectors.toSet());
        roles.add(role);
        user.setRoles(roles);
        return userRepository.save(user);
    }
}
