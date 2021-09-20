package io.agileintelligence.ppmtool.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.AppMail;
import io.agileintelligence.ppmtool.domain.Inbox;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.exceptions.InvalidAppMailDetailsException;
import io.agileintelligence.ppmtool.repositories.AppMailRepository;
import io.agileintelligence.ppmtool.repositories.BadgeRepository;
import io.agileintelligence.ppmtool.repositories.InboxRepository;

@Service
public class AppMailService {
    @Autowired
    private AppMailRepository appMailRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private InboxRepository inboxRepository;

    public void sendAppMail(AppMail appMail, String username) {
        User sender = userService.getUserByUsername(username);

        if (!sender.getUsername().equals(appMail.getSender())) {
            throw new InvalidAppMailDetailsException("Logged in user can be sender only");
        }

        User receiver = userService.getUserByUsername(appMail.getReceiver());
        
        if (appMail.getSubject() == null || appMail.getSubject().equals(""))
            appMail.setSubject("[No Subject]");
        
        if (appMail.getBadge() == null) {
            appMail.setBadge(badgeRepository.getBadgeByName("GENERAL"));
        }

        appMail.setSentTime(new Date());
        appMail.setSeen(false);
        appMail.setSeenTime(null);
        appMail.setReplyOf(null);

        appMailRepository.save(appMail);
        Inbox senderInbox = inboxRepository.getInboxByUser(username);
        Set<AppMail> sent = senderInbox.getSentMails();
        sent.add(appMail);
        senderInbox.setSentMails(sent);
        inboxRepository.save(senderInbox);

        Inbox receiverInbox = inboxRepository.getInboxByUser(appMail.getReceiver());
        Set<AppMail> received = receiverInbox.getReceivedMails();
        received.add(appMail);
        receiverInbox.setReceivedMails(received);
        inboxRepository.save(receiverInbox);
	}

	public List<AppMail> getReceivedAppMails(int page, int per_page, String username) {
        User user = userService.getUserByUsername(username);
        Inbox inbox = inboxRepository.getInboxByUser(username);
        List<AppMail> receivedMails = new ArrayList<AppMail>(inbox.getReceivedMails());
        Set<AppMail> trashedMails = inbox.getTrashedMails();

        Collections.sort(receivedMails, (a, b) -> (int) (a.getSentTime().getTime() - b.getSentTime().getTime()));
        
        List<AppMail> currentPage = new ArrayList<AppMail>();
        int start_index = (page-1) * per_page;
        for (int i = start_index; i < start_index + per_page && i < receivedMails.size(); i++)
            if (!trashedMails.contains(receivedMails.get(i)))
                currentPage.add(receivedMails.get(i));
            else
                i--;
        
        return currentPage;
	}

    public void replyToAppMail(AppMail appMail, String username) {
        User sender = userService.getUserByUsername(username);

        if (!sender.getUsername().equals(appMail.getSender())) {
            throw new InvalidAppMailDetailsException("Logged in user can be sender only");
        }

        if (appMail.getReplyOf() == null) {
            throw new InvalidAppMailDetailsException("Reply mail can not be null");
        } else {
            AppMail replyOf = appMailRepository.getById(appMail.getReplyOf().getId());

            if (replyOf == null)
                throw new InvalidAppMailDetailsException("Reply mail can not be null");

            if (!appMail.getReceiver().equals(replyOf.getSender())) {
                throw new InvalidAppMailDetailsException(
                        "Reply has to be sent to the sender of the mail to which it is intended to reply");
            }

            replyOf.setSeen(true);
            appMailRepository.save(replyOf);
        }
        
        if (appMail.getSubject() == null || appMail.getSubject().equals(""))
            appMail.setSubject("[No Subject]");
        
        if (appMail.getBadge() == null) {
            appMail.setBadge(badgeRepository.getBadgeByName("GENERAL"));
        }

        appMail.setSentTime(new Date());
        appMail.setSeen(false);
        appMail.setSeenTime(null);

        appMailRepository.save(appMail);

        Inbox senderInbox = inboxRepository.getInboxByUser(username);
        Set<AppMail> sent = senderInbox.getSentMails();
        sent.add(appMail);
        senderInbox.setSentMails(sent);
        inboxRepository.save(senderInbox);

        Inbox receiverInbox = inboxRepository.getInboxByUser(appMail.getReceiver());
        Set<AppMail> received = receiverInbox.getReceivedMails();
        received.add(appMail);
        receiverInbox.setReceivedMails(received);
        inboxRepository.save(receiverInbox);
	}

    public List<AppMail> getSentAppMails(int page, int per_page, String username) {
        User user = userService.getUserByUsername(username);
        Inbox inbox = inboxRepository.getInboxByUser(username);
        List<AppMail> sentMails = new ArrayList<AppMail>(inbox.getSentMails());
        Set<AppMail> trashedMails = inbox.getTrashedMails();

        Collections.sort(sentMails, (a, b) -> (int) (a.getSentTime().getTime() - b.getSentTime().getTime()));
        
        List<AppMail> currentPage = new ArrayList<AppMail>();
        int start_index = (page-1) * per_page;
        for (int i = start_index; i < start_index + per_page && i < sentMails.size(); i++)
            if (!trashedMails.contains(sentMails.get(i)))
                currentPage.add(sentMails.get(i));
            else
                i--;
        
        return currentPage;
    }

    public void moveToTrash(Long appMailId, String username) {
        User user = userService.getUserByUsername(username);
        AppMail appMail = appMailRepository.getById(appMailId);
        if (appMail == null) {
            throw new InvalidAppMailDetailsException("AppMail not found with id '" + appMailId + "'");
        }

        Inbox inbox = inboxRepository.getInboxByUser(username);
        Set<AppMail> trashedMails = inbox.getTrashedMails();

        Set<AppMail> receivedMails = inbox.getReceivedMails();
        Set<AppMail> sentMails = inbox.getSentMails();

        if (receivedMails.contains(appMail)) {
            receivedMails.remove(appMail);
            trashedMails.add(appMail);

            inbox.setReceivedMails(receivedMails);
            inbox.setTrashedMails(trashedMails);
        } else if (sentMails.contains(appMail)) {
            sentMails.remove(appMail);
            trashedMails.remove(appMail);

            inbox.setSentMails(sentMails);
            inbox.setTrashedMails(trashedMails);
        }

        inboxRepository.save(inbox);  
    }

    public List<AppMail> getTrashedAppMails(int page, int per_page, String username) {
        User user = userService.getUserByUsername(username);
        Inbox inbox = inboxRepository.getInboxByUser(username);
        List<AppMail> trashedMails = new ArrayList<AppMail>(inbox.getTrashedMails());

        Collections.sort(trashedMails, (a, b) -> (int) (a.getSentTime().getTime() - b.getSentTime().getTime()));

        List<AppMail> currentPage = new ArrayList<AppMail>();
        int start_index = (page - 1) * per_page;
        for (int i = start_index; i < start_index + per_page && i < trashedMails.size(); i++)
            currentPage.add(trashedMails.get(i));

        return currentPage;
    }

    public List<AppMail> moveToTrash(List<Long> appMailIds, int page, int per_page, String username) {
        User user = userService.getUserByUsername(username);
        Inbox inbox = inboxRepository.getInboxByUser(username);
        Set<AppMail> receivedMails = inbox.getReceivedMails();
        Set<AppMail> trashedMails = inbox.getTrashedMails();
        Set<Long> trashIds = new HashSet<Long>(appMailIds);
        
        boolean removed = receivedMails.removeIf(mail -> {
            if (trashIds.contains(mail.getId())) {
                trashedMails.add(mail);
                return true;
            } else
                return false;
        });

        if (removed) {
            inbox.setReceivedMails(receivedMails);
            inbox.setTrashedMails(trashedMails);
            inboxRepository.save(inbox);

            return getReceivedAppMails(page, per_page, username);
        } else {
            Set<AppMail> sentMails = inbox.getSentMails();
            sentMails.removeIf(mail -> {
                if (trashIds.contains(mail.getId())) {
                    trashedMails.add(mail);
                    return true;
                } else
                    return false;
            });
            inbox.setSentMails(sentMails);
            inbox.setTrashedMails(trashedMails);
            inboxRepository.save(inbox);

            return getSentAppMails(page, per_page, username);
        }
	}

    public void markAppMailAsRead(Long appMailId, String username) {
        User user = userService.getUserByUsername(username);
        Inbox inbox = inboxRepository.getInboxByUser(username);

        AppMail appMail = appMailRepository.getById(appMailId);
        if (!inbox.getReceivedMails().contains(appMail)
                || (inbox.getTrashedMails().contains(appMail) && !appMail.getReceiver().equals(username))) {
            throw new InvalidAppMailDetailsException(
                    "Attempt to mark as read an AppMail which is not received by '" + username + "'");
        }

        appMail.setSeen(true);
        appMailRepository.save(appMail);
	}

}
