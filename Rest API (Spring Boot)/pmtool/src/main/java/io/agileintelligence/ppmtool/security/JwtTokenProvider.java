package io.agileintelligence.ppmtool.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.agileintelligence.ppmtool.domain.User;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

import static io.agileintelligence.ppmtool.security.SecurityConstants.EXPIRATION_TIME;
import static io.agileintelligence.ppmtool.security.SecurityConstants.SECRET;

@Component
public class JwtTokenProvider {

    @Autowired
    private AppProperties appProperties;

    @Autowired
    private UserRepository userRepository;
    
    // Generate token
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        String userId = Long.toString(userPrincipal.getId());

        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("id", userId);
        claims.put("username", userPrincipal.getUsername());
        claims.put("fullName", userPrincipal.getFullname());
        claims.put("imageUrl", userRepository.findByUsername(userPrincipal.getUsername()).getImageUrl());
        claims.put("verified", userRepository.findByUsername(userPrincipal.getUsername()).getEmailVerified());
        
        // roles can also be included

        return Jwts.builder().setSubject(userId)
                .setClaims(claims)
                .setIssuedAt(now).setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret()).compact();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            System.out.println("Invalid JWT Signature");
        } catch (MalformedJwtException ex) {
            System.out.println("Invalid JWT Token");
        } catch (ExpiredJwtException ex) {
            System.out.println("Expired JWT Token");
        } catch (UnsupportedJwtException ex) {
            System.out.println("Unsupported JWT Token");
        } catch (IllegalArgumentException ex) {
            System.out.println("JWT claims string is empty");
        }

        return false;
    }

    // Get User id from token
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token)
                .getBody();
        String id = (String) claims.get("id");
        return Long.parseLong(id);
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token)
                .getBody();
        String username = (String) claims.get("username");
        // return Long.parseLong(id);
        return username;
    }
    
}
