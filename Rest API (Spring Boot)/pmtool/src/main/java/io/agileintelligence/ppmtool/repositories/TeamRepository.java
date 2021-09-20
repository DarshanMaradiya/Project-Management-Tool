package io.agileintelligence.ppmtool.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Team;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {

    Team getTeamById(Long id);

}
