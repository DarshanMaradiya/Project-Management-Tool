package io.agileintelligence.ppmtool.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
public class Inbox {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String user;

    @OneToMany
    private Set<AppMail> receivedMails = new HashSet<AppMail>();

    @OneToMany
    private Set<AppMail> sentMails = new HashSet<AppMail>();

    @OneToMany
    private Set<AppMail> trashedMails = new HashSet<AppMail>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public Set<AppMail> getReceivedMails() {
		return receivedMails;
	}

	public void setReceivedMails(Set<AppMail> receivedMails) {
		this.receivedMails = receivedMails;
	}

	public Set<AppMail> getSentMails() {
		return sentMails;
	}

	public void setSentMails(Set<AppMail> sentMails) {
		this.sentMails = sentMails;
	}

	public Set<AppMail> getTrashedMails() {
		return trashedMails;
	}

	public void setTrashedMails(Set<AppMail> trashedMails) {
		this.trashedMails = trashedMails;
	}


}
