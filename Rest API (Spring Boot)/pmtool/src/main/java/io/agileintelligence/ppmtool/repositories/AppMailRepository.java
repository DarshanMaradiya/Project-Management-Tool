package io.agileintelligence.ppmtool.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import io.agileintelligence.ppmtool.domain.AppMail;

@Repository
public interface AppMailRepository extends CrudRepository<AppMail, Long> {
    List<AppMail> findAllAppMailBySender(String sender);

	List<AppMail> findAllAppMailByReceiver(String receiver);

    AppMail getById(Long appMailId);
}
