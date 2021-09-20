package io.agileintelligence.ppmtool.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Backlog;
import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.domain.TeamMember;

@Repository
public interface ProjectTaskRepository extends CrudRepository<ProjectTask, Long> {

    List<ProjectTask> findByProjectIdentifierOrderByPriority(String projectIdentifier);

    ProjectTask findByProjectSequenceAndBacklog(String projectSequence, Backlog backlog);

    ProjectTask getByProjectSequence(String projectSequence);

    List<ProjectTask> findAllProjectTasksByAssigneeUserUsername(String username);

    List<ProjectTask> findAllProjectTasksByDependeciesContaining(ProjectTask projectTask);
}
