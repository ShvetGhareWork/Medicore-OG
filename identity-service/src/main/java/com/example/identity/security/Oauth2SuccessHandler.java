package com.example.identity.security;

import com.example.identity.dto.LoginResponseDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(Oauth2SuccessHandler.class);

    private final AuthService authService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public Oauth2SuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        try {
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = token.getPrincipal();

            String registrationId = token.getAuthorizedClientRegistrationId();
            log.info("OAuth2 login success for registrationId: {}", registrationId);

            ResponseEntity<LoginResponseDto> loginResponse = authService.handleOAuth2LoginRequest(oAuth2User, registrationId);

            if (loginResponse.getBody() != null) {
                String jwt = loginResponse.getBody().getJwt();
                Long userId = loginResponse.getBody().getId();

                String redirectUrl = frontendUrl + "/oauth2/callback?token=" +
                        URLEncoder.encode(jwt, StandardCharsets.UTF_8) +
                        "&userId=" + userId;

                log.info("Redirecting OAuth2 authenticated user to frontend: {}", redirectUrl);
                response.sendRedirect(redirectUrl);
            } else {
                response.sendRedirect(frontendUrl + "/login?error=OAuth2AuthenticationFailed");
            }
        } catch (Exception e) {
            log.error("Error processing OAuth2 login success: {}", e.getMessage(), e);
            response.sendRedirect(frontendUrl + "/login?error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8));
        }
    }
}
