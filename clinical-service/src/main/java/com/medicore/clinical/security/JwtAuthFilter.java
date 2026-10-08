package com.medicore.clinical.security;

import com.medicore.clinical.service.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);
            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String jti = claims.getId();
            if (jti != null && tokenBlacklistService.isBlacklisted(jti)) {
                log.warn("Blocked request with blacklisted JWT jti: {}", jti);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been revoked");
                return;
            }

            String username = claims.getSubject();
            String userIdStr = claims.get("userId", String.class);
            UUID userId = userIdStr != null ? UUID.fromString(userIdStr) : null;
            String fullName = claims.get("fullName", String.class);
            String email = claims.get("email", String.class);
            String staffId = claims.get("staffId", String.class);

            List<String> roles;
            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof List<?>) {
                roles = ((List<?>) rolesObj).stream().map(Object::toString).toList();
            } else {
                roles = Collections.emptyList();
            }

            UserPrincipal principal = UserPrincipal.builder()
                    .userId(userId)
                    .username(username)
                    .fullName(fullName)
                    .email(email)
                    .staffId(staffId)
                    .roles(roles)
                    .jti(jti)
                    .build();

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    principal.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Populate MDC for distributed tracing and structured audit
            if (userId != null) MDC.put("userId", userId.toString());
            if (username != null) MDC.put("username", username);

        } catch (Exception e) {
            log.warn("JWT token parsing/validation failed: {}", e.getMessage());
        } finally {
            try {
                filterChain.doFilter(request, response);
            } finally {
                MDC.remove("userId");
                MDC.remove("username");
            }
        }
    }
}
