package io.agileintelligence.ppmtool.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Team;
import io.agileintelligence.ppmtool.domain.TeamMember;

@Repository
public interface TeamMemberRepository extends CrudRepository<TeamMember, Long> {
    TeamMember getByTeamAndUserUsername(Team team, String username);
}
