package io.agileintelligence.ppmtool.security;

public class SecurityConstants {
    public static final String SIGN_UP_URLS = "/api/users/**";
    public static final String H2_URL = "/h2/**";
    public static final String SECRET = "SecretKeyToGenerateJWTs";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final long EXPIRATION_TIME = 6000_000; // 6000 sec
    public static final String DEFAULT_ROLE = "ROLE_USER";
    public static final String MEMBER_ROLE = "ROLE_MEMBER";
    public static final String LEADER_ROLE = "ROLE_LEADER";
}
