package io.agileintelligence.ppmtool.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Badge;

@Repository
public interface BadgeRepository extends CrudRepository<Badge, Long> {
    Badge getBadgeByName(String name);
}
