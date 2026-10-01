package com.example.identity.service;

import com.example.identity.dto.LoginResponseDto;
import com.example.identity.dto.TotpEnableRequest;
import com.example.identity.dto.TotpSetupResponse;
import com.example.identity.dto.TotpVerifyRequest;
import com.example.identity.entity.User;
import com.example.identity.repository.UserRepository;
import com.example.identity.security.AuthUtil;
import com.example.identity.security.TotpUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MfaService {

    private final UserRepository userRepository;
    private final TotpUtil totpUtil;
    private final AuthUtil authUtil;
    private final AdminAuditLogService auditLogService;

    public MfaService(UserRepository userRepository, TotpUtil totpUtil, AuthUtil authUtil, AdminAuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.totpUtil = totpUtil;
        this.authUtil = authUtil;
        this.auditLogService = auditLogService;
    }

    public TotpSetupResponse setupMfa(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByStaffId(username))
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String secretKey = totpUtil.generateSecret();
        String qrCodeUri = totpUtil.getQrCodeUri(user.getUsername(), secretKey);

        return new TotpSetupResponse(secretKey, qrCodeUri, user.getUsername());
    }

    @Transactional
    public boolean enableMfa(String username, TotpEnableRequest request) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByStaffId(username))
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        boolean isValid = totpUtil.verifyCode(request.getSecretKey(), request.getTotpCode());
        if (!isValid) {
            auditLogService.logEvent("MFA_ENABLE_FAILED", user.getUsername(), user.getId(),
                    user.getRoles().toString(), "FAILED", "Invalid TOTP verification code during setup");
            throw new BadCredentialsException("Invalid 6-digit confirmation code. Make sure your device time is synchronized.");
        }

        user.setMfaSecret(request.getSecretKey());
        user.setMfaEnabled(true);
        userRepository.save(user);

        auditLogService.logEvent("MFA_ENABLED", user.getUsername(), user.getId(),
                user.getRoles().toString(), "SUCCESS", "TOTP Two-Factor Authentication enabled");

        return true;
    }

    @Transactional
    public boolean disableMfa(String username, String totpCode) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByStaffId(username))
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!user.isMfaEnabled()) {
            return true;
        }

        boolean isValid = totpUtil.verifyCode(user.getMfaSecret(), totpCode);
        if (!isValid) {
            auditLogService.logEvent("MFA_DISABLE_FAILED", user.getUsername(), user.getId(),
                    user.getRoles().toString(), "FAILED", "Invalid code during MFA disable request");
            throw new BadCredentialsException("Invalid 6-digit code. Cannot disable MFA without verification.");
        }

        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);

        auditLogService.logEvent("MFA_DISABLED", user.getUsername(), user.getId(),
                user.getRoles().toString(), "SUCCESS", "TOTP Two-Factor Authentication disabled");

        return true;
    }

    @Transactional
    public LoginResponseDto verifyMfaLogin(TotpVerifyRequest request) {
        String tokenOrUsername = request.getTempToken();
        String username;

        if (authUtil.isMfaPendingToken(tokenOrUsername)) {
            username = authUtil.getUsernameFromToken(tokenOrUsername);
        } else {
            username = tokenOrUsername;
        }

        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByStaffId(username))
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new BadCredentialsException("Invalid session or user identifier"));

        if (!user.isMfaEnabled() || user.getMfaSecret() == null) {
            String fullJwt = authUtil.generateAccessToken(user);
            return new LoginResponseDto(fullJwt, user.getId());
        }

        boolean isValid = totpUtil.verifyCode(user.getMfaSecret(), request.getTotpCode());
        if (!isValid) {
            auditLogService.logEvent("MFA_LOGIN_FAILED", user.getUsername(), user.getId(),
                    user.getRoles().toString(), "FAILED", "Invalid 6-digit Authenticator code entered");
            throw new BadCredentialsException("Invalid 6-digit Authenticator code.");
        }

        auditLogService.logEvent("MFA_LOGIN_SUCCESS", user.getUsername(), user.getId(),
                user.getRoles().toString(), "SUCCESS", "Two-step MFA authentication verified successfully");

        String fullJwt = authUtil.generateAccessToken(user);
        return new LoginResponseDto(fullJwt, user.getId());
    }
}
