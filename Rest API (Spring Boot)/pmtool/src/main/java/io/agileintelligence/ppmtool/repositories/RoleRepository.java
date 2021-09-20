package io.agileintelligence.ppmtool.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
    Role getRoleByName(String name);
}
