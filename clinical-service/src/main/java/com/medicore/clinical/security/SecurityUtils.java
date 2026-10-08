package com.medicore.clinical.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<UserPrincipal> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return Optional.of((UserPrincipal) authentication.getPrincipal());
        }
        return Optional.empty();
    }

    public static UUID getCurrentUserId() {
        return getCurrentUser().map(UserPrincipal::getUserId).orElse(null);
    }

    public static String getCurrentUsername() {
        return getCurrentUser().map(UserPrincipal::getUsername).orElse("anonymous");
    }

    public static String getCurrentFullName() {
        return getCurrentUser().map(UserPrincipal::getFullName).orElse("Unknown Staff");
    }

    public static boolean hasRole(String role) {
        return getCurrentUser()
                .map(user -> user.getRoles() != null && user.getRoles().stream().anyMatch(r -> r.equalsIgnoreCase(role) || r.equalsIgnoreCase("ROLE_" + role)))
                .orElse(false);
    }
}
