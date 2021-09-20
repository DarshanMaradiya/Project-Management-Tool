package io.agileintelligence.ppmtool.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import io.agileintelligence.ppmtool.exceptions.InvalidLoginResponse;

// Auth entry point is an interface that provides implementation for commence()
@Component // so that this configuration gets picked up on fire of our application
           // (mandatory)
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
            AuthenticationException authenticationException) throws IOException, ServletException {
        // the response we want to return
        InvalidLoginResponse loginResponse = new InvalidLoginResponse();
        // to convert it into JSON string
        String jsonLoginResponse = new Gson().toJson(loginResponse);

        // response type, status, and actual response
        httpServletResponse.setContentType("application/json");
        httpServletResponse.setStatus(401);
        httpServletResponse.getWriter().print(jsonLoginResponse);
        // httpServletResponse.getOutputStream().println("{ \"error\": \"" + +"\" }");
    }
}