package io.agileintelligence.ppmtool.security.oauth2;

import io.agileintelligence.ppmtool.exceptions.OAuth2AuthenticationProcessingException;
import io.agileintelligence.ppmtool.domain.AuthProvider;
import io.agileintelligence.ppmtool.domain.Inbox;
import io.agileintelligence.ppmtool.domain.Role;
import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.repositories.InboxRepository;
import io.agileintelligence.ppmtool.repositories.RoleRepository;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import io.agileintelligence.ppmtool.security.UserPrincipal;
import io.agileintelligence.ppmtool.security.oauth2.user.OAuth2UserInfo;
import io.agileintelligence.ppmtool.security.oauth2.user.OAuth2UserInfoFactory;

import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import static io.agileintelligence.ppmtool.security.SecurityConstants.DEFAULT_ROLE;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private InboxRepository inboxRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        System.out.println(">>>>>> " + oAuth2UserRequest.getAccessToken().getTokenValue());
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            if (oAuth2UserRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase("github")) {
                oAuth2UserInfo.setEmail(requestEmail(oAuth2UserRequest.getAccessToken().getTokenValue(), "github"));
            } else if (oAuth2UserRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase("linkedin")) {
                oAuth2UserInfo.setEmail(requestEmail(oAuth2UserRequest.getAccessToken().getTokenValue(), "linkedin"));
                oAuth2UserInfo.setImageUrl(requestImageUrl(oAuth2UserRequest.getAccessToken().getTokenValue()));
            } else {
                throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
            }
        }

        User user = userRepository.findByUsername(oAuth2UserInfo.getEmail());
        if (user != null) {
            if (!user.getProvider()
                    .equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + user.getProvider() + " account. Please use your "
                                + user.getProvider() + " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            user.setEmailVerified(true);
            user = userRepository.save(user);
        }
        
        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setFullname(oAuth2UserInfo.getName());
        user.setUsername(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());

        Set<Role> roles = user.getRoles();
        Role role = roleRepository.getRoleByName(DEFAULT_ROLE);
        roles.add(role);
        user.setRoles(roles);
        
        user = userRepository.save(user);
        Inbox inbox = new Inbox();
        inbox.setUser(user.getUsername());
        inboxRepository.save(inbox);
        return user;
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setUsername(oAuth2UserInfo.getEmail());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        
        return userRepository.save(existingUser);
    }

    private String requestEmail(String token, String registrationId) {
        String url = "";
        HttpHeaders headers = new HttpHeaders();
        switch (registrationId) {
        case "github":
            url = "https://api.github.com/user/emails";
            headers.set("Authorization", "token " + token);
            break;
        case "linkedin":
            url = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token="
                    + token;
            break;
        }

        HttpEntity request = new HttpEntity(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class, 1);

        if (response.getStatusCode() == HttpStatus.OK) {
            switch (registrationId) {
            case "github": {
                List<Map<String, Object>> emails = (List<Map<String, Object>>) JSONValue.parse(response.getBody());
                String primaryEmail = "";

                for (int i = 0; i < emails.size(); i++) {
                    Map<String, Object> email = (Map<String, Object>) emails.get(i);
                    if ((boolean) email.get("primary")) {
                        primaryEmail = (String) email.get("email");
                        break;
                    }
                }
                return primaryEmail;
            }
            case "linkedin": {
                Map<String, Object> obj = (Map<String, Object>) JSONValue.parse(response.getBody());
                List<Map<String, Object>> elements = (List<Map<String, Object>>) obj.get("elements");
                Map<String, Object> element = (Map<String, Object>) elements.get(0);
                Map<String, Object> handle_ = (Map<String, Object>) element.get("handle~");
                String email = (String) handle_.get("emailAddress");
                return email;
            }
            default:
                return null;
            }

        } else {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
    }

    private String requestImageUrl(String token) {
        String url = "https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~digitalmediaAsset:playableStreams))";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity request = new HttpEntity(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, request, Object.class, 1);
        if (response.getStatusCode() == HttpStatus.OK && ((Map<String, Object>) response.getBody()).size() != 0) {
            Map<String, Object> profilePicture = (Map<String, Object>) ((Map<String, Object>) response.getBody()).get("profilePicture");
            Map<String, Object> displayImg_ = (Map<String, Object>) profilePicture.get("displayImage~");
            List<Map<String, Object>> elements = (List<Map<String, Object>>) displayImg_.get("elements");
            Map<String, Object> lastElement = (Map<String, Object>) elements.get(elements.size() - 1);
            List<Map<String, Object>> identifiers = (List<Map<String, Object>>) lastElement.get("identifiers");
            Map<String, Object> firstIdentifier = (Map<String, Object>) identifiers.get(0);
            String imageUrl = (String) firstIdentifier.get("identifier");
            return imageUrl;
        } else
            return null;
    }
}
