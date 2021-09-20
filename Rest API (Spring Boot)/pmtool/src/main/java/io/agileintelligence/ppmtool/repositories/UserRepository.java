package io.agileintelligence.ppmtool.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Role;
import io.agileintelligence.ppmtool.domain.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    User findByUsername(String username);

    User getById(Long id);

    Set<User> findByUsernameContainingIgnoreCase(String keyword);

    Set<User> findByFullnameContainingIgnoreCase(String keyword);
}
