package io.agileintelligence.ppmtool.services;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import io.agileintelligence.ppmtool.domain.EmailRequest;
import io.agileintelligence.ppmtool.domain.User;

@Service
public class MailService {
    /*
     * The Spring Framework provides an easy abstraction for sending email by using
     * the JavaMailSender interface, and Spring Boot provides auto-configuration for
     * it as well as a starter module.
     */
    @Autowired
	private JavaMailSender javaMailSender;

	// @Autowired
	// public MailService(JavaMailSender javaMailSender) {
	// 	this.javaMailSender = javaMailSender;
	// }

    public void sendEmail(EmailRequest emailRequest) throws MailException {

		/*
		 * This JavaMailSender Interface is used to send Mail in Spring Boot. This
		 * JavaMailSender extends the MailSender Interface which contains send()
		 * function. SimpleMailMessage Object is required because send() function uses
		 * object of SimpleMailMessage as a Parameter
		 */

		SimpleMailMessage mail = new SimpleMailMessage();
		mail.setTo(emailRequest.getEmail());
		mail.setSubject(emailRequest.getSubject());
		mail.setText(emailRequest.getBody());

		/*
		 * This send() contains an Object of SimpleMailMessage as an Parameter
		 */
		javaMailSender.send(mail);
		System.out.println(">>>>> Mail sent");
	}
    
	public void sendEmailWithAttachment(EmailRequest emailRequest) throws MailException, MessagingException {

		MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

		try {
			helper.setFrom(new InternetAddress("noreply@pmt.com", "Project Management Tool"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		helper.setTo(emailRequest.getEmail());
		helper.setSubject(emailRequest.getSubject());
		helper.setText(emailRequest.getBody(), true);

		// ClassPathResource classPathResource = new ClassPathResource("Attachment.pdf");
		// helper.addAttachment(classPathResource.getFilename(), classPathResource);

		javaMailSender.send(mimeMessage);
		System.out.println(">>>>> Mail sent");
	}

}
