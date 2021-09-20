package io.agileintelligence.ppmtool.security.oauth2.user;

import java.util.HashMap;
import java.util.Map;

public class GithubOAuth2UserInfo extends OAuth2UserInfo {

    public GithubOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return ((Integer) attributes.get("id")).toString();
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        setImageUrl((String) attributes.get("avatar_url"));
        return (String) attributes.get("imageUrl");
    }

    @Override
    public void setImageUrl(String imageUrl) {
        attributes = new HashMap<String, Object>(attributes);
        attributes.put("imageUrl", imageUrl);
    }

}
