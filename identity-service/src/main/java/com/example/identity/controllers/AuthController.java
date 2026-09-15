package com.example.identity.controllers;

import com.example.identity.dto.*;
import com.example.identity.security.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
