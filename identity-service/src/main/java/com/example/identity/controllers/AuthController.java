package com.example.identity.controllers;

import com.example.identity.dto.*;
import com.example.identity.security.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.identity.service.MfaService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;
    private final com.example.identity.config.DataInitializer dataInitializer;

    public AuthController(AuthService authService, MfaService mfaService,
                          com.example.identity.config.DataInitializer dataInitializer) {
        this.authService = authService;
        this.mfaService = mfaService;
        this.dataInitializer = dataInitializer;
    }

    @PostMapping("/seed-admin")
    public ResponseEntity<Map<String, String>> seedAdmin() {
        dataInitializer.seedDefaultAdmin();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "email", "admin@medicore.org",
                "staffId", "ADM-2026-0001",
                "password", "Admin@12345",
                "message", "Default admin account verified and ready for login."
        ));
    }

    @PostMapping("/admin/register")
    public ResponseEntity<Map<String, Object>> registerAdmin(@Valid @RequestBody AdminRegisterRequestDto adminRegisterRequestDto) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(authService.registerAdmin(adminRegisterRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signup(@RequestBody SignUpRequestDto signUpRequestDto) {
        return ResponseEntity.ok(authService.signup(signUpRequestDto));
    }

    @PostMapping("/badge-login")
    public ResponseEntity<LoginResponseDto> badgeLogin(@Valid @RequestBody BadgeLoginRequest badgeLoginRequest) {
        return ResponseEntity.ok(authService.badgeLogin(badgeLoginRequest));
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<LoginResponseDto> verifyMfa(@Valid @RequestBody TotpVerifyRequest request) {
        return ResponseEntity.ok(mfaService.verifyMfaLogin(request));
    }

    @PostMapping("/mfa/setup")
    public ResponseEntity<TotpSetupResponse> setupMfa(Authentication authentication, @RequestParam(required = false) String username) {
        String targetUser = authentication != null ? authentication.getName() : username;
        if (targetUser == null || targetUser.isBlank()) {
            throw new IllegalArgumentException("Username is required to setup MFA");
        }
        return ResponseEntity.ok(mfaService.setupMfa(targetUser));
    }

    @PostMapping("/mfa/enable")
    public ResponseEntity<Map<String, Object>> enableMfa(Authentication authentication,
                                                         @RequestParam(required = false) String username,
                                                         @Valid @RequestBody TotpEnableRequest request) {
        String targetUser = authentication != null ? authentication.getName() : username;
        if (targetUser == null || targetUser.isBlank()) {
            throw new IllegalArgumentException("Username is required to enable MFA");
        }
        boolean enabled = mfaService.enableMfa(targetUser, request);
        return ResponseEntity.ok(Map.of("success", enabled, "message", "Two-Factor Authentication enabled successfully."));
    }

    @PostMapping("/mfa/disable")
    public ResponseEntity<Map<String, Object>> disableMfa(Authentication authentication,
                                                          @RequestParam(required = false) String username,
                                                          @RequestParam String totpCode) {
        String targetUser = authentication != null ? authentication.getName() : username;
        if (targetUser == null || targetUser.isBlank()) {
            throw new IllegalArgumentException("Username is required to disable MFA");
        }
        boolean disabled = mfaService.disableMfa(targetUser, totpCode);
        return ResponseEntity.ok(Map.of("success", disabled, "message", "Two-Factor Authentication disabled."));
    }
}
