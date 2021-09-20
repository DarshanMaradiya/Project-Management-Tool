package io.agileintelligence.ppmtool.web;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.EmailRequest;
import io.agileintelligence.ppmtool.services.MailService;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    
    @Autowired
    private MailService mailService;

    @GetMapping
    public String SayHelloFromMailService() {
        return "Hit the MailController";
    }

    @PostMapping("/")
    public ResponseEntity<?> sendSimpleMail(@RequestBody EmailRequest emailRequest) {
        // mailService.sendEmail(emailRequest);
        try {
            mailService.sendEmailWithAttachment(emailRequest);
        } catch (MailException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (MessagingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return new ResponseEntity<String>("Sent Successfully", HttpStatus.OK);
    }
}
