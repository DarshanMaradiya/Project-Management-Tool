package io.agileintelligence.ppmtool.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import io.agileintelligence.ppmtool.repositories.BadgeRepository;
import io.agileintelligence.ppmtool.repositories.RoleRepository;

@Component
public class LoadData implements ApplicationRunner{

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        Role user_role = roleRepository.save(new Role("ROLE_USER"));
        Role member = roleRepository.save(new Role("ROLE_MEMBER"));
        Role leader = roleRepository.save(new Role("ROLE_LEADER"));

        Badge general = badgeRepository.save(new Badge("GENERAL", "green", "General"));
        Badge important = badgeRepository.save(new Badge("IMPORTANT", "red", "important"));
        Badge information = badgeRepository.save(new Badge("INFORMATION", "green", "information"));
    }
    
}
