package com.example.identity.config;

import com.example.identity.entity.User;
import com.example.identity.entity.type.AccessLevelType;
import com.example.identity.entity.type.AuthProviderType;
import com.example.identity.entity.type.LoginMethodType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;
import com.example.identity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedDefaultAdmin();
    }

    public void seedDefaultAdmin() {
        String adminEmail = "admin@medicore.org";
        String adminStaffId = "ADM-2026-0001";
        String adminUsername = "admin";

        // Find existing admin if present
        User admin = userRepository.findByUsername(adminEmail)
                .or(() -> userRepository.findByStaffId(adminStaffId))
                .or(() -> userRepository.findByEmail(adminEmail))
                .or(() -> userRepository.findByUsername(adminUsername))
                .orElse(null);

        if (admin == null) {
            log.info("Creating default Super Administrator account...");
            admin = User.builder()
                    .username(adminEmail)
                    .email(adminEmail)
                    .fullName("Hospital Super Administrator")
                    .staffId(adminStaffId)
                    .password(passwordEncoder.encode("Admin@12345"))
                    .providerType(AuthProviderType.EMAIL)
                    .roles(Set.of(RoleType.ADMIN, RoleType.ADMINISTRATIVE))
                    .accessLevel(AccessLevelType.FULL)
                    .loginMethod(LoginMethodType.PASSWORD)
                    .badgeToken("ADMIN-BADGE-0001")
                    .status(StaffStatusType.ACTIVE)
                    .department("Administration")
                    .designation("Chief Medical Administrator")
                    .build();
            admin.setFailedLoginAttempts(0);
            admin.setLockedUntil(null);
        } else {
            log.info("Updating & resetting default Super Administrator account credentials...");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            admin.setRoles(Set.of(RoleType.ADMIN, RoleType.ADMINISTRATIVE));
            admin.setAccessLevel(AccessLevelType.FULL);
            admin.setBadgeToken("ADMIN-BADGE-0001");
            admin.setStaffId(adminStaffId);
            admin.setStatus(StaffStatusType.ACTIVE);
            admin.setFailedLoginAttempts(0);
            admin.setLockedUntil(null);
        }

        userRepository.save(admin);
        log.info("==================================================================");
        log.info(" DEFAULT ADMIN ACCOUNT READY:");
        log.info(" Username / Email: {}", admin.getUsername());
        log.info(" Staff ID:         {}", adminStaffId);
        log.info(" Password:         Admin@12345");
        log.info(" Badge Token:      ADMIN-BADGE-0001");
        log.info(" Roles:            ADMIN, ADMINISTRATIVE");
        log.info("==================================================================");
    }
}
