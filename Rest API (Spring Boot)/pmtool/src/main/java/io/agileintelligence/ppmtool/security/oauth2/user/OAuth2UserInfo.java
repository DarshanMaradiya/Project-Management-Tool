package io.agileintelligence.ppmtool.security.oauth2.user;

import java.util.HashMap;
import java.util.Map;

public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        for(Map.Entry<String, Object> x: attributes.entrySet()) System.out.println(x.getKey() + " = " + x.getValue());
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public abstract String getId();

    public abstract String getName();

    public abstract String getEmail();

    public abstract String getImageUrl();

    public void setEmail(String email) {
        attributes = new HashMap<String, Object>(attributes);
        attributes.put("email", email);
    }

    public void setImageUrl(String imageUrl) {
        attributes = new HashMap<String, Object>(attributes);
        attributes.put("imageUrl", imageUrl);
    }
}
