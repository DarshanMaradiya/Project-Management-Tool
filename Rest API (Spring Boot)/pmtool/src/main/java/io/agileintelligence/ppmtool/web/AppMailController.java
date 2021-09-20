package io.agileintelligence.ppmtool.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.agileintelligence.ppmtool.domain.AppMail;
import io.agileintelligence.ppmtool.security.CurrentUser;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.services.AppMailService;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;

@RestController
@CrossOrigin
@RequestMapping("/api/appmail")
public class AppMailController {
    
    @Autowired
    private AppMailService appMailService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMail(@RequestBody AppMail appMail, @CurrentUser UserPrincipal principal, BindingResult result) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null)
            return errorMap;
        appMailService.sendAppMail(appMail, principal.getName());
        return new ResponseEntity<String>("Mail sent successfully", HttpStatus.CREATED);
    }

    @GetMapping("/inbox")
    public ResponseEntity<?> getReceivedAppMails(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "per_page", defaultValue = "10") int per_page, @CurrentUser UserPrincipal principal) {
        List<AppMail> inbox = appMailService.getReceivedAppMails(page, per_page, principal.getName());
        return new ResponseEntity<List<AppMail>>(inbox, HttpStatus.OK);
    }

    @PostMapping("/reply")
    public ResponseEntity<?> sendReplyToAppMail(@RequestBody AppMail appMail, @CurrentUser UserPrincipal principal, BindingResult result) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null)
            return errorMap;
        appMailService.replyToAppMail(appMail, principal.getName());
        return new ResponseEntity<String>("Reply sent successfully", HttpStatus.CREATED);
    }

    @GetMapping("/outbox")
    public ResponseEntity<?> getSentAppMails(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "per_page", defaultValue = "10") int per_page, @CurrentUser UserPrincipal principal) {
        List<AppMail> inbox = appMailService.getSentAppMails(page, per_page, principal.getName());
        return new ResponseEntity<List<AppMail>>(inbox, HttpStatus.OK);
    }

    @GetMapping("/trash/{appMailId}")
    public ResponseEntity<?> trashAnAppMail(@PathVariable Long appMailId, @CurrentUser UserPrincipal principal) {
        appMailService.moveToTrash(appMailId, principal.getName());
        return new ResponseEntity<String>("Moved to trash successfully", HttpStatus.OK);
    }

    @GetMapping("/trash")
    public ResponseEntity<?> getTrashedAppMails(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "per_page", defaultValue = "10") int per_page, @CurrentUser UserPrincipal principal) {
        List<AppMail> inbox = appMailService.getTrashedAppMails(page, per_page, principal.getName());
        return new ResponseEntity<List<AppMail>>(inbox, HttpStatus.OK);
    }

    @PostMapping("/trash")
    public ResponseEntity<?> trashAllAppMails(@RequestBody List<Long> appMailIds, @RequestParam(name = "page", defaultValue = "1") int page,
    @RequestParam(name = "per_page", defaultValue = "10") int per_page,
            @CurrentUser UserPrincipal principal) {
        List<AppMail> updatedAppMails = appMailService.moveToTrash(appMailIds, page, per_page,
                principal.getUsername());
        return new ResponseEntity<List<AppMail>>(updatedAppMails, HttpStatus.OK);
    }
    
    @GetMapping("/read/{appMailId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long appMailId, @CurrentUser UserPrincipal principal) {
        appMailService.markAppMailAsRead(appMailId, principal.getName());
        return new ResponseEntity<String>("Mark as Read", HttpStatus.OK);
    }

}
