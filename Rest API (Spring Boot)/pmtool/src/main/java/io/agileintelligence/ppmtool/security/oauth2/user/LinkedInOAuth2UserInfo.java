package io.agileintelligence.ppmtool.security.oauth2.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;

public class LinkedInOAuth2UserInfo extends OAuth2UserInfo {

    public LinkedInOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getName() {
        return (String) attributes.get("localizedFirstName") + " " + (String) attributes.get("localizedLastName");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("emailAddress");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("imageUrl");//((Map<String, Object>)attributes.get("profilePicture")).get("displayImage");
    }

    @Override
    public void setEmail(String email) {
        attributes = new HashMap<String, Object>(attributes);
        attributes.put("emailAddress", email);
    }

    @Override
    public void setImageUrl(String imageUrl) {
        attributes = new HashMap<String, Object>(attributes);
        attributes.put("imageUrl", imageUrl);
    }
}
