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
    private final com.example.identity.repository.StaffRepository staffRepository;
    private final com.example.identity.repository.DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           com.example.identity.repository.StaffRepository staffRepository,
                           com.example.identity.repository.DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedDefaultAdmin();
        syncLegacyUsersToStaff();
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

        // Ensure default admin is in staff table as well
        if (staffRepository.findByStaffId(adminStaffId).isEmpty() && staffRepository.findByEmail(adminEmail).isEmpty()) {
            com.example.identity.entity.Department adminDept = departmentRepository.findByNameIgnoreCase("Administration")
                    .orElseGet(() -> {
                        com.example.identity.entity.Department d = new com.example.identity.entity.Department();
                        d.setName("Administration");
                        d.setCode("ADM");
                        return departmentRepository.save(d);
                    });

            com.example.identity.entity.Staff staff = new com.example.identity.entity.Staff();
            staff.setStaffId(adminStaffId);
            staff.setFullName("Hospital Super Administrator");
            staff.setEmail(adminEmail);
            staff.setRole(RoleType.ADMINISTRATIVE);
            staff.setDepartment(adminDept);
            staff.setDesignation("Chief Medical Administrator");
            staff.setAccessLevel(AccessLevelType.FULL);
            staff.setLoginMethod(LoginMethodType.PASSWORD);
            staff.setStatus(StaffStatusType.ACTIVE);
            staff.setCreatedByStaffId(adminStaffId);
            staffRepository.save(staff);
        }

        log.info("==================================================================");
        log.info(" DEFAULT ADMIN ACCOUNT READY:");
        log.info(" Username / Email: {}", admin.getUsername());
        log.info(" Staff ID:         {}", adminStaffId);
        log.info(" Password:         Admin@12345");
        log.info(" Badge Token:      ADMIN-BADGE-0001");
        log.info(" Roles:            ADMIN, ADMINISTRATIVE");
        log.info("==================================================================");
    }

    public void syncLegacyUsersToStaff() {
        try {
            com.example.identity.entity.Department adminDept = departmentRepository.findByNameIgnoreCase("Administration")
                    .orElseGet(() -> {
                        com.example.identity.entity.Department d = new com.example.identity.entity.Department();
                        d.setName("Administration");
                        d.setCode("ADM");
                        return departmentRepository.save(d);
                    });

            userRepository.findAll().forEach(u -> {
                if (u.getEmail() != null && !u.getEmail().isBlank()) {
                    boolean staffExists = staffRepository.findByEmail(u.getEmail()).isPresent()
                            || (u.getStaffId() != null && staffRepository.findByStaffId(u.getStaffId()).isPresent());

                    if (!staffExists) {
                        String sId = u.getStaffId() != null && !u.getStaffId().isBlank()
                                ? u.getStaffId()
                                : "STF-" + u.getId();

                        RoleType role = u.getRoles() != null && !u.getRoles().isEmpty()
                                ? (u.getRoles().contains(RoleType.ADMIN) ? RoleType.ADMINISTRATIVE : u.getRoles().iterator().next())
                                : RoleType.ADMINISTRATIVE;

                        com.example.identity.entity.Staff staff = new com.example.identity.entity.Staff();
                        staff.setStaffId(sId);
                        staff.setFullName(u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername());
                        staff.setEmail(u.getEmail());
                        staff.setRole(role);
                        staff.setDepartment(adminDept);
                        staff.setDesignation(u.getDesignation() != null ? u.getDesignation() : "Staff Member");
                        staff.setAccessLevel(u.getAccessLevel() != null ? u.getAccessLevel() : AccessLevelType.STANDARD);
                        staff.setLoginMethod(u.getLoginMethod() != null ? u.getLoginMethod() : LoginMethodType.PASSWORD);
                        staff.setStatus(u.getStatus() != null ? u.getStatus() : StaffStatusType.ACTIVE);
                        staff.setCreatedByStaffId(sId);
                        staffRepository.save(staff);
                        log.info("Synced user '{}' ({}) to staff table", u.getUsername(), sId);
                    }
                }
            });
        } catch (Exception e) {
            log.warn("Auto-sync of legacy users to staff table encountered an issue: {}", e.getMessage());
        }
    }
}
