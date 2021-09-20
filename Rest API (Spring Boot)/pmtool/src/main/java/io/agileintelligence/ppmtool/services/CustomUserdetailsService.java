package io.agileintelligence.ppmtool.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import io.agileintelligence.ppmtool.security.UserPrincipal;

@Service
public class CustomUserdetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return UserPrincipal.create(user);
    }

    // @Transactional
    // public UserDetails loadUserById(Long id) {
    //     User user = userRepository.getById(id);
    //     if (user == null) {
    //         throw new UsernameNotFoundException("User not found");
    //     }
    //     return UserPrincipal.create(user);
    // }

}
