package io.agileintelligence.ppmtool.domain;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity
public class AppMail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String subject;
    @OneToOne
    private Badge badge;
    @NotNull(message = "Message is required")
    private String message;

    @NotNull(message = "Sender in required")
    private String sender;

    @NotNull(message = "Recipient is required")
    private String receiver;

    private boolean seen;

    private Date sentTime;

    private Date seenTime;

    @OneToOne
    private AppMail replyOf;
    
    public AppMail() {
    }

	public Date getSeenTime() {
        return seenTime;
    }

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public Badge getBadge() {
		return badge;
	}

	public void setBadge(Badge badge) {
		this.badge = badge;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public boolean isSeen() {
		return seen;
	}

	public void setSeen(boolean seen) {
		this.seen = seen;
	}

	public Date getSentTime() {
		return sentTime;
	}

	public void setSentTime(Date sentTime) {
		this.sentTime = sentTime;
	}

	public void setSeenTime(Date seenTime) {
		this.seenTime = seenTime;
	}

	public AppMail getReplyOf() {
		return replyOf;
	}

    public void setReplyOf(AppMail replyOf) {
        this.replyOf = replyOf;
    }
    
}
