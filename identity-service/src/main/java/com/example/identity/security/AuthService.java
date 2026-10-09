package com.example.identity.security;

import com.example.identity.dto.*;
import com.example.identity.entity.User;
import com.example.identity.entity.type.AuthProviderType;
import com.example.identity.entity.type.LoginMethodType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;
import com.example.identity.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.identity.service.AdminAuditLogService;
import com.example.identity.service.ClinicalLoginEventPublisher;
import org.springframework.security.authentication.LockedException;

import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final com.example.identity.repository.StaffRepository staffRepository;
    private final com.example.identity.repository.DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtil authUtil;
    private final AdminAuditLogService auditLogService;
    private final ClinicalLoginEventPublisher loginEventPublisher;
    private final String adminRegistrationSecret;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       com.example.identity.repository.StaffRepository staffRepository,
                       com.example.identity.repository.DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder, AuthUtil authUtil, AdminAuditLogService auditLogService,
                       ClinicalLoginEventPublisher loginEventPublisher,
                       @Value("${app.security.admin-registration-secret:MediCore@AdminSecret2026}") String adminRegistrationSecret) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authUtil = authUtil;
        this.auditLogService = auditLogService;
        this.loginEventPublisher = loginEventPublisher;
        this.adminRegistrationSecret = adminRegistrationSecret;
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        String identifier = loginRequestDto.getUsername() != null ? loginRequestDto.getUsername().trim() : "";

        // Check if user exists to enforce lockout
        Optional<User> userOpt = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByStaffId(identifier))
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> "admin".equalsIgnoreCase(identifier) ? userRepository.findByUsername("admin@medicore.org") : Optional.empty())
                .or(() -> "admin".equalsIgnoreCase(identifier) ? userRepository.findByStaffId("ADM-2026-0001") : Optional.empty());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
                auditLogService.logEvent("LOGIN_BLOCKED_LOCKED", identifier, user.getId(),
                        user.getRoles().toString(), "BLOCKED", "Attempted login while account is locked until " + user.getLockedUntil());
                throw new LockedException("Account is temporarily locked due to excessive failed attempts. Please try again later or contact IT Security.");
            }
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, loginRequestDto.getPassword())
            );
        } catch (BadCredentialsException e) {
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                int attempts = user.getFailedLoginAttempts() + 1;
                user.setFailedLoginAttempts(attempts);

                if (attempts >= 5) {
                    user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
                    userRepository.save(user);
                    auditLogService.logEvent("ADMIN_ACCOUNT_LOCKED", identifier, user.getId(),
                            user.getRoles().toString(), "LOCKED", "Account locked for 30 minutes after " + attempts + " consecutive failed attempts");
                    throw new LockedException("Account locked for 30 minutes due to 5 consecutive failed login attempts.");
                } else {
                    userRepository.save(user);
                    auditLogService.logEvent("LOGIN_FAILED", identifier, user.getId(),
                            user.getRoles().toString(), "FAILED", "Invalid credentials. Attempt " + attempts + " of 5");
                }
            } else {
                auditLogService.logEvent("LOGIN_FAILED", identifier, null, "UNKNOWN", "FAILED", "User identifier not recognized");
            }
            throw new BadCredentialsException("Invalid credentials or login failed.");
        }

        User user = (User) authentication.getPrincipal();

        // Reset failed attempts on successful login
        if (user.getFailedLoginAttempts() > 0 || user.getLockedUntil() != null) {
            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);
        }

        auditLogService.logEvent("LOGIN_SUCCESS", user.getUsername(), user.getId(),
                user.getRoles().toString(), "SUCCESS", "User authenticated successfully via password");

        if (user.isMfaEnabled() && user.getMfaSecret() != null) {
            String tempToken = authUtil.generateMfaPendingToken(user);
            auditLogService.logEvent("MFA_CHALLENGE_ISSUED", user.getUsername(), user.getId(),
                    user.getRoles().toString(), "PENDING", "Credentials verified. MFA Authenticator challenge issued");
            return new LoginResponseDto(true, tempToken);
        }

        String token = authUtil.generateAccessToken(user);
        return new LoginResponseDto(
                token,
                user.getId(),
                user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getUsername(),
                user.getEmail() != null ? user.getEmail() : "",
                user.getUsername(),
                user.getStaffId() != null ? user.getStaffId() : "",
                user.getRoles().stream().map(Enum::name).toList()
        );
    }

    public LoginResponseDto badgeLogin(BadgeLoginRequest badgeLoginRequest) {
        String staffId = badgeLoginRequest.getStaffId() != null ? badgeLoginRequest.getStaffId().trim() : "";

        User user = userRepository.findByStaffIdAndBadgeToken(
                staffId,
                badgeLoginRequest.getBadgeToken() != null ? badgeLoginRequest.getBadgeToken().trim() : ""
        ).orElseGet(() -> {
            auditLogService.logEvent("BADGE_LOGIN_FAILED", staffId, null, "UNKNOWN", "FAILED", "Invalid Staff ID or Badge Token");
            loginEventPublisher.publishFailure(staffId, "INVALID_CREDENTIALS", "CLINICAL_TERMINAL");
            throw new BadCredentialsException("Invalid Staff ID or Badge Token");
        });

        if (user.getStatus() != StaffStatusType.ACTIVE) {
            auditLogService.logEvent("BADGE_LOGIN_BLOCKED", staffId, user.getId(),
                    user.getRoles().toString(), "BLOCKED", "Staff account is not in ACTIVE status: " + user.getStatus());
            loginEventPublisher.publishFailure(staffId, "ACCOUNT_INACTIVE", "CLINICAL_TERMINAL");
            throw new BadCredentialsException("Staff account is inactive or pending");
        }

        auditLogService.logEvent("BADGE_LOGIN_SUCCESS", staffId, user.getId(),
                user.getRoles().toString(), "SUCCESS", "Hardware badge verified successfully");
        loginEventPublisher.publishSuccess(staffId, user.getRoles().toString(), "CLINICAL_TERMINAL");

        String token = authUtil.generateAccessToken(user);
        return new LoginResponseDto(
                token,
                user.getId(),
                user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getUsername(),
                user.getEmail() != null ? user.getEmail() : "",
                user.getUsername(),
                user.getStaffId() != null ? user.getStaffId() : "",
                user.getRoles().stream().map(Enum::name).toList()
        );
    }

    public User signUpInternal(SignUpRequestDto signUpRequestDto, AuthProviderType authProviderType, String providerId) {
        User user = userRepository.findByUsername(signUpRequestDto.getUsername()).orElse(null);

        if (user != null) {
            throw new IllegalArgumentException("User already exists");
        }

        user = User.builder()
                .username(signUpRequestDto.getUsername())
                .providerId(providerId)
                .providerType(authProviderType)
                .roles(signUpRequestDto.getRoles() != null && !signUpRequestDto.getRoles().isEmpty() ?
                        signUpRequestDto.getRoles() : Set.of(RoleType.PATIENT))
                .build();

        if (authProviderType == AuthProviderType.EMAIL) {
            user.setPassword(passwordEncoder.encode(signUpRequestDto.getPassword()));
        }

        return userRepository.save(user);
    }

    public SignUpResponseDto signup(SignUpRequestDto signUpRequestDto) {
        if (signUpRequestDto.getRoles() != null) {
            signUpRequestDto.getRoles().remove(RoleType.ADMIN);
            signUpRequestDto.getRoles().remove(RoleType.ADMINISTRATIVE);
            if (signUpRequestDto.getRoles().isEmpty()) {
                signUpRequestDto.setRoles(Set.of(RoleType.PATIENT));
            }
        } else {
            signUpRequestDto.setRoles(Set.of(RoleType.PATIENT));
        }
        User user = signUpInternal(signUpRequestDto, AuthProviderType.EMAIL, null);
        return new SignUpResponseDto(user.getId(), user.getUsername());
    }

    @Transactional
    public ResponseEntity<LoginResponseDto> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User, registrationId);

        User user = userRepository.findByProviderIdAndProviderType(providerId, providerType).orElse(null);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User emailUser = email != null ? userRepository.findByUsername(email).orElse(null) : null;

        if (user == null && emailUser == null) {
            String username = authUtil.determineUsernameFromOAuth2User(oAuth2User, registrationId, providerId);
            user = signUpInternal(new SignUpRequestDto(username, null, name, Set.of(RoleType.PATIENT)), providerType, providerId);
        } else if (user != null) {
            if (email != null && !email.isBlank() && !email.equals(user.getUsername())) {
                user.setUsername(email);
                userRepository.save(user);
            }
        } else {
            throw new BadCredentialsException("This email is already registered with provider " + emailUser.getProviderType());
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto(authUtil.generateAccessToken(user), user.getId());
        return ResponseEntity.ok(loginResponseDto);
    }

    public Map<String, Object> registerAdmin(AdminRegisterRequestDto request) {
        if (!adminRegistrationSecret.equals(request.getSecretKey())) {
            auditLogService.logEvent("ADMIN_REGISTRATION_FAILED", request.getUsername(), null,
                    "ADMIN", "FORBIDDEN", "Invalid admin registration secret key provided");
            throw new BadCredentialsException("Invalid Admin Master Secret Key. Administrative registration denied.");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already in use.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email address '" + request.getEmail() + "' is already registered.");
        }

        String staffId = "ADM-2026-" + String.format("%04d", (int) (Math.random() * 9000) + 1000);
        while (userRepository.findByStaffId(staffId).isPresent()) {
            staffId = "ADM-2026-" + String.format("%04d", (int) (Math.random() * 9000) + 1000);
        }

        User adminUser = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim())
                .fullName(request.getFullName().trim())
                .staffId(staffId)
                .providerType(AuthProviderType.EMAIL)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(RoleType.ADMIN, RoleType.ADMINISTRATIVE))
                .status(StaffStatusType.ACTIVE)
                .build();

        User saved = userRepository.save(adminUser);

        // Also create matching Staff entity so admin appears in staff directory
        com.example.identity.entity.Department adminDept = departmentRepository.findByNameIgnoreCase("Administration")
                .orElseGet(() -> {
                    com.example.identity.entity.Department d = new com.example.identity.entity.Department();
                    d.setName("Administration");
                    d.setCode("ADM");
                    return departmentRepository.save(d);
                });

        com.example.identity.entity.Staff adminStaff = new com.example.identity.entity.Staff();
        adminStaff.setStaffId(staffId);
        adminStaff.setFullName(request.getFullName().trim());
        adminStaff.setEmail(request.getEmail().trim());
        adminStaff.setRole(RoleType.ADMINISTRATIVE);
        adminStaff.setDepartment(adminDept);
        adminStaff.setDesignation("Hospital Administrator");
        adminStaff.setAccessLevel(AccessLevelType.FULL);
        adminStaff.setLoginMethod(LoginMethodType.PASSWORD);
        adminStaff.setStatus(StaffStatusType.ACTIVE);
        adminStaff.setCreatedByStaffId(staffId);
        staffRepository.save(adminStaff);

        auditLogService.logEvent("ADMIN_REGISTERED", saved.getUsername(), saved.getId(),
                saved.getRoles().toString(), "SUCCESS", "Administrator account created with Staff ID " + staffId);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Administrator account registered successfully.");
        response.put("userId", saved.getId());
        response.put("username", saved.getUsername());
        response.put("email", saved.getEmail());
        response.put("staffId", saved.getStaffId());
        response.put("fullName", saved.getFullName() != null ? saved.getFullName() : saved.getUsername());
        return response;
    }
}
