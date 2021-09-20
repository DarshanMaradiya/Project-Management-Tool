package io.agileintelligence.ppmtool.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.core.http.converter.OAuth2AccessTokenResponseHttpMessageConverter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import io.agileintelligence.ppmtool.security.oauth2.CustomOAuth2UserService;
import io.agileintelligence.ppmtool.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import io.agileintelligence.ppmtool.security.oauth2.OAuth2AuthenticationFailureHandler;
import io.agileintelligence.ppmtool.security.oauth2.OAuth2AuthenticationSuccessHandler;
import io.agileintelligence.ppmtool.services.CustomUserdetailsService;

import static io.agileintelligence.ppmtool.security.SecurityConstants.SIGN_UP_URLS;

import java.util.Arrays;

import static io.agileintelligence.ppmtool.security.SecurityConstants.H2_URL;

@Configuration
@EnableWebSecurity // to enable the security
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private CustomUserdetailsService customUserdetailsService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationEntryFilter() {
        return new JwtAuthenticationFilter();
    }

    /*
      By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save
      the authorization request. But, since our service is stateless, we can't save it in
      the session. We'll save the request in a Base64 encoded cookie instead.
    */
    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable() // to disable cors and csrf
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler) // exceptionhandling by
                // customizing auth entry
                // point
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Rest API we want is
                // stateless and don't
                // want to store
                // sessions
                .and().headers().frameOptions().sameOrigin() // To enable H2 Database
                .and().authorizeRequests()
                .antMatchers("/", "/error", "/favicon.ico", "/**/*.png", "/**/*.gif", "/**/*.svg", "/**/*.jpg",
                        "/**/*.html", "/**/*.css", "/**/*.js")
                .permitAll() // to by default give permissions to these routes
                .antMatchers(SIGN_UP_URLS).permitAll().antMatchers(H2_URL).permitAll()
                .antMatchers("/auth/**", "/oauth2/**").permitAll().anyRequest().authenticated().and().oauth2Login()
                .authorizationEndpoint().baseUri("/oauth2/authorize")
                .authorizationRequestRepository(cookieAuthorizationRequestRepository()).and()
                .tokenEndpoint().accessTokenResponseClient(authorizationCodeTokenResponseClient()).and()
                .redirectionEndpoint().baseUri("/oauth2/callback/*").and()
                .userInfoEndpoint().userService(customOAuth2UserService).and()
                .successHandler(oAuth2AuthenticationSuccessHandler).failureHandler(oAuth2AuthenticationFailureHandler);
        ;

        http.addFilterBefore(jwtAuthenticationEntryFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    private OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> authorizationCodeTokenResponseClient() {
		OAuth2AccessTokenResponseHttpMessageConverter tokenResponseHttpMessageConverter =
				new OAuth2AccessTokenResponseHttpMessageConverter();
		tokenResponseHttpMessageConverter.setTokenResponseConverter(new CustomAccessTokenResponseConverter());

		RestTemplate restTemplate = new RestTemplate(Arrays.asList(
				new FormHttpMessageConverter(), tokenResponseHttpMessageConverter));
		restTemplate.setErrorHandler(new OAuth2ErrorResponseErrorHandler());

		DefaultAuthorizationCodeTokenResponseClient tokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
		tokenResponseClient.setRestOperations(restTemplate);

		return tokenResponseClient;
	}

    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserdetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
}
