package io.agileintelligence.ppmtool.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.Inbox;

@Repository
public interface InboxRepository extends CrudRepository<Inbox, Long> {
    Inbox getInboxByUser(String user);
}
