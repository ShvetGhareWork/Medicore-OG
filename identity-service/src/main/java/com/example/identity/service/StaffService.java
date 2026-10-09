package com.example.identity.service;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffListItemResponse;
import com.example.identity.dto.StaffResponse;
import com.example.identity.dto.UpdateStaffRequest;
import com.example.identity.entity.Department;
import com.example.identity.entity.Staff;
import com.example.identity.entity.User;
import com.example.identity.entity.type.*;
import com.example.identity.entity.OutboxEvent;
import com.example.identity.repository.DepartmentRepository;
import com.example.identity.repository.OutboxEventRepository;
import com.example.identity.repository.StaffRepository;
import com.example.identity.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class StaffService {

    private static final Logger log = LoggerFactory.getLogger(StaffService.class);

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OutboxEventRepository outboxEventRepository;
    private final StaffCredentialEmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public StaffService(StaffRepository staffRepository,
                        DepartmentRepository departmentRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        OutboxEventRepository outboxEventRepository,
                        StaffCredentialEmailService emailService) {
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.outboxEventRepository = outboxEventRepository;
        this.emailService = emailService;
    }

    public String getRolePrefix(RoleType role) {
        if (role == null) {
            return "STF";
        }
        return switch (role) {
            case DOCTOR -> "DOC";
            case NURSE -> "NRS";
            case PATHOLOGIST -> "LAB";
            case INSURANCE_COORDINATOR -> "INS";
            case ADMINISTRATIVE -> "ADM";
            case LAB_TECHNICIAN -> "LTC";
            default -> "STF";
        };
    }

    @Transactional
    public String generateStaffId(RoleType role) {
        String prefix = getRolePrefix(role);
        int currentYear = Year.now().getValue();
        String prefixYear = prefix + "-" + currentYear;
        String pattern = prefixYear + "-%";

        List<String> existingStaffIds = staffRepository.findStaffIdsForPrefixWithLock(pattern);

        int maxSeq = 0;
        for (String staffId : existingStaffIds) {
            if (staffId != null && staffId.startsWith(prefixYear + "-")) {
                String seqStr = staffId.substring((prefixYear + "-").length());
                try {
                    int seq = Integer.parseInt(seqStr);
                    if (seq > maxSeq) {
                        maxSeq = seq;
                    }
                } catch (NumberFormatException ignored) {
                }
            }
        }

        int newSeq = maxSeq + 1;
        return String.format("%s-%04d", prefixYear, newSeq);
    }

    public String generateBadgeToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "") +
                    Long.toHexString(secureRandom.nextLong());
        } while (userRepository.existsByBadgeToken(token));
        return token;
    }

    @Transactional
    public StaffResponse createStaff(CreateStaffRequest request) {
        if (staffRepository.existsByEmail(request.getEmail()) || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists");
        }

        Department department = null;
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            department = departmentRepository.findByNameIgnoreCase(request.getDepartment())
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName(request.getDepartment());
                        d.setCode(request.getDepartment().toUpperCase().replaceAll("[^A-Z]", ""));
                        return departmentRepository.save(d);
                    });
        }

        String staffId = generateStaffId(request.getRole());
        String badgeToken = generateBadgeToken();

        LoginMethodType loginMethod = request.getLoginMethod() != null ? request.getLoginMethod() : LoginMethodType.BADGE_QR;
        String hashedPassword = null;
        if (loginMethod == LoginMethodType.PASSWORD && request.getTemporaryPassword() != null && !request.getTemporaryPassword().isBlank()) {
            hashedPassword = passwordEncoder.encode(request.getTemporaryPassword());
        }

        AccessLevelType accessLevel = request.getAccessLevel() != null ? request.getAccessLevel() : AccessLevelType.STANDARD;

        String currentStaffId = null;
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof User currentUser) {
                currentStaffId = currentUser.getStaffId() != null && !currentUser.getStaffId().isBlank()
                        ? currentUser.getStaffId()
                        : (currentUser.getEmail() != null ? currentUser.getEmail() : currentUser.getUsername());
            } else if (authentication.getName() != null && !authentication.getName().isBlank()) {
                String authName = authentication.getName();
                currentStaffId = userRepository.findByUsername(authName)
                        .or(() -> userRepository.findByEmail(authName))
                        .map(u -> u.getStaffId() != null && !u.getStaffId().isBlank() ? u.getStaffId() : u.getUsername())
                        .orElse(authName);
            }
        }

        Staff staff = new Staff();
        staff.setStaffId(staffId);
        staff.setFullName(request.getFullName());
        staff.setEmail(request.getEmail());
        staff.setContactNumber(request.getContactNumber());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setRole(request.getRole());
        staff.setDepartment(department);
        staff.setDesignation(request.getDesignation());
        staff.setAccessLevel(accessLevel);
        staff.setLoginMethod(loginMethod);
        staff.setPhotoUrl(request.getPhotoUrl());
        staff.setStatus(StaffStatusType.ACTIVE);
        staff.setCreatedByStaffId(currentStaffId);

        Staff savedStaff = staffRepository.save(staff);

        // Also create User record for authentication
        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(hashedPassword)
                .providerType(AuthProviderType.EMAIL)
                .roles(Set.of(request.getRole()))
                .staffId(staffId)
                .department(department != null ? department.getName() : request.getDepartment())
                .designation(request.getDesignation())
                .dateOfBirth(request.getDateOfBirth())
                .contactNumber(request.getContactNumber())
                .photoUrl(request.getPhotoUrl())
                .accessLevel(accessLevel)
                .loginMethod(loginMethod)
                .badgeToken(badgeToken)
                .badgeVersion(1)
                .status(StaffStatusType.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // Transactional Outbox: save event for staff credential email (NO badgeToken in Kafka payload!)
        String payload = """
            {
              "eventId": "%s",
              "staffId": "%s",
              "email": "%s",
              "fullName": "%s",
              "role": "%s",
              "timestamp": "%s"
            }
            """.formatted(
                UUID.randomUUID().toString(),
                staffId,
                request.getEmail(),
                request.getFullName(),
                request.getRole().name(),
                LocalDateTime.now()
        );

        OutboxEvent outbox = new OutboxEvent("staff.created", staffId, payload);
        outboxEventRepository.save(outbox);

        return mapToStaffResponse(savedStaff, savedUser);
    }

    public Page<StaffListItemResponse> getStaffList(RoleType role, String department, StaffStatusType status, String search, Pageable pageable) {
        return getStaffList(role, department, status, search, null, pageable);
    }

    public Page<StaffListItemResponse> getStaffList(RoleType role, String department, StaffStatusType status, String search, String createdByStaffId, Pageable pageable) {
        Specification<Staff> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            if (department != null && !department.isBlank() && !"All Departments".equalsIgnoreCase(department)) {
                predicates.add(cb.like(cb.lower(root.get("department").get("name")), "%" + department.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (createdByStaffId != null && !createdByStaffId.isBlank()) {
                Optional<User> creatorOpt = userRepository.findByStaffId(createdByStaffId)
                        .or(() -> userRepository.findByUsername(createdByStaffId))
                        .or(() -> userRepository.findByEmail(createdByStaffId));

                if (creatorOpt.isPresent()) {
                    User creator = creatorOpt.get();
                    List<String> possibleIds = new ArrayList<>();
                    if (creator.getStaffId() != null && !creator.getStaffId().isBlank()) possibleIds.add(creator.getStaffId());
                    if (creator.getUsername() != null && !creator.getUsername().isBlank()) possibleIds.add(creator.getUsername());
                    if (creator.getEmail() != null && !creator.getEmail().isBlank()) possibleIds.add(creator.getEmail());
                    possibleIds.add(createdByStaffId);

                    predicates.add(root.get("createdByStaffId").in(possibleIds));
                } else {
                    predicates.add(cb.equal(root.get("createdByStaffId"), createdByStaffId));
                }
            }

            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("fullName")), searchPattern),
                        cb.like(cb.lower(root.get("email")), searchPattern),
                        cb.like(cb.lower(root.get("staffId")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Staff> page = staffRepository.findAll(spec, pageable);
        return page.map(this::mapToStaffListItemResponse);
    }

    public Staff findStaffByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("Staff identifier is required");
        }
        try {
            Long id = Long.parseLong(identifier.trim());
            Optional<Staff> staffOpt = staffRepository.findById(id);
            if (staffOpt.isPresent()) {
                return staffOpt.get();
            }
        } catch (NumberFormatException ignored) {
        }

        return staffRepository.findByStaffId(identifier.trim())
                .or(() -> staffRepository.findByEmail(identifier.trim()))
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with identifier: " + identifier));
    }

    public StaffResponse getStaffById(Long id) {
        return getStaffByIdentifier(String.valueOf(id));
    }

    public StaffResponse getStaffByIdentifier(String identifier) {
        Staff staff = findStaffByIdentifier(identifier);
        User user = userRepository.findByEmail(staff.getEmail())
                .or(() -> userRepository.findByStaffId(staff.getStaffId()))
                .orElse(null);
        return mapToStaffResponse(staff, user);
    }

    @Transactional
    public StaffResponse deactivateStaff(Long id) {
        return deactivateStaff(String.valueOf(id));
    }

    @Transactional
    public StaffResponse deactivateStaff(String identifier) {
        Staff staff = findStaffByIdentifier(identifier);
        staff.setStatus(StaffStatusType.INACTIVE);
        Staff savedStaff = staffRepository.save(staff);

        User user = userRepository.findByEmail(staff.getEmail())
                .or(() -> userRepository.findByStaffId(staff.getStaffId()))
                .orElse(null);
        if (user != null) {
            user.setStatus(StaffStatusType.INACTIVE);
            user.setBadgeVersion(user.getBadgeVersion() + 1);
            userRepository.save(user);

            // Lifecycle event to Kafka via Outbox
            String lifecyclePayload = """
                {
                  "eventId": "%s",
                  "eventType": "STAFF_DEACTIVATED",
                  "staffId": "%s",
                  "timestamp": "%s"
                }
                """.formatted(UUID.randomUUID().toString(), staff.getStaffId(), LocalDateTime.now());
            outboxEventRepository.save(new OutboxEvent("staff.lifecycle", staff.getStaffId(), lifecyclePayload));
        }

        return mapToStaffResponse(savedStaff, user);
    }

    @Transactional
    public StaffResponse resendCredentials(Long id) {
        return resendCredentials(String.valueOf(id));
    }

    @Transactional
    public StaffResponse resendCredentials(String identifier) {
        Staff staff = findStaffByIdentifier(identifier);
        
        String newBadgeToken = generateBadgeToken();
        String generatedStaffId = staff.getStaffId() != null && !staff.getStaffId().isBlank() 
                ? staff.getStaffId() 
                : generateStaffId(staff.getRole() != null ? staff.getRole() : RoleType.DOCTOR);
        if (staff.getStaffId() == null || staff.getStaffId().isBlank()) {
            staff.setStaffId(generatedStaffId);
            staff = staffRepository.save(staff);
        }

        final Staff targetStaff = staff;
        final String staffId = generatedStaffId;
        final String email = targetStaff.getEmail() != null ? targetStaff.getEmail().trim() : "";
        final String fullName = targetStaff.getFullName() != null ? targetStaff.getFullName() : "Staff Member";
        final String roleName = targetStaff.getRole() != null ? targetStaff.getRole().name() : "DOCTOR";

        // Find or auto-provision corresponding User record
        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findByStaffId(staffId))
                .orElseGet(() -> {
                    log.info("Auto-provisioning User account for staff: {} ({})", fullName, email);
                    User newUser = User.builder()
                            .username(!email.isBlank() ? email : staffId)
                            .email(email)
                            .fullName(fullName)
                            .password(passwordEncoder.encode("Medicore@" + staffId))
                            .providerType(AuthProviderType.EMAIL)
                            .roles(targetStaff.getRole() != null ? Set.of(targetStaff.getRole()) : Set.of(RoleType.DOCTOR))
                            .staffId(staffId)
                            .department(targetStaff.getDepartment() != null ? targetStaff.getDepartment().getName() : "General")
                            .designation(targetStaff.getDesignation() != null ? targetStaff.getDesignation() : "Staff")
                            .dateOfBirth(targetStaff.getDateOfBirth())
                            .contactNumber(targetStaff.getContactNumber())
                            .photoUrl(targetStaff.getPhotoUrl())
                            .accessLevel(targetStaff.getAccessLevel() != null ? targetStaff.getAccessLevel() : AccessLevelType.STANDARD)
                            .loginMethod(targetStaff.getLoginMethod() != null ? targetStaff.getLoginMethod() : LoginMethodType.PASSWORD)
                            .badgeToken(newBadgeToken)
                            .badgeVersion(1)
                            .status(StaffStatusType.ACTIVE)
                            .build();
                    return userRepository.save(newUser);
                });

        // Rotate token & increment version to invalidate previous token
        user.setBadgeToken(newBadgeToken);
        user.setBadgeVersion(user.getBadgeVersion() > 0 ? user.getBadgeVersion() + 1 : 1);
        if (user.getStaffId() == null || user.getStaffId().isBlank()) {
            user.setStaffId(staffId);
        }
        User savedUser = userRepository.save(user);

        // Transactional Outbox: trigger fresh email credential delivery via Kafka
        String payload = """
            {
              "eventId": "%s",
              "staffId": "%s",
              "email": "%s",
              "fullName": "%s",
              "role": "%s",
              "timestamp": "%s"
            }
            """.formatted(
                UUID.randomUUID().toString(),
                staffId,
                email,
                fullName,
                roleName,
                LocalDateTime.now()
        );

        outboxEventRepository.save(new OutboxEvent("staff.created", staffId, payload));

        // Direct async attempt for instant email delivery if email is present
        if (!email.isBlank()) {
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendWelcomeCredentials(
                            email,
                            fullName,
                            staffId,
                            newBadgeToken,
                            roleName
                    );
                    log.info("Direct email dispatched for resendCredentials to {}", email);
                } catch (Exception e) {
                    log.warn("Direct email delivery failed on resendCredentials ({}), outbox relay will handle: {}", email, e.getMessage());
                }
            });
        }

        return mapToStaffResponse(targetStaff, savedUser);
    }

    @Transactional
    public void deleteStaff(Long id) {
        deleteStaff(String.valueOf(id));
    }

    @Transactional
    public void deleteStaff(String identifier) {
        Staff staff = findStaffByIdentifier(identifier);

        String staffId = staff.getStaffId();
        String email = staff.getEmail();

        // Delete associated User entity if present
        userRepository.findByEmail(email)
                .or(() -> userRepository.findByStaffId(staffId))
                .ifPresent(userRepository::delete);

        // Delete Staff entity
        staffRepository.delete(staff);

        // Publish lifecycle deletion event to Kafka via Transactional Outbox
        String lifecyclePayload = """
            {
              "eventId": "%s",
              "eventType": "STAFF_DELETED",
              "staffId": "%s",
              "email": "%s",
              "timestamp": "%s"
            }
            """.formatted(UUID.randomUUID().toString(), staffId, email, LocalDateTime.now());
        outboxEventRepository.save(new OutboxEvent("staff.lifecycle", staffId, lifecyclePayload));
    }

    @Transactional
    public StaffResponse updateStaff(Long id, UpdateStaffRequest request) {
        return updateStaff(String.valueOf(id), request);
    }

    @Transactional
    public StaffResponse updateStaff(String identifier, UpdateStaffRequest request) {
        Staff staff = findStaffByIdentifier(identifier);

        Department department = null;
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            department = departmentRepository.findByNameIgnoreCase(request.getDepartment())
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName(request.getDepartment());
                        d.setCode(request.getDepartment().toUpperCase().replaceAll("[^A-Z]", ""));
                        return departmentRepository.save(d);
                    });
        }

        RoleType oldRole = staff.getRole();
        staff.setFullName(request.getFullName());
        staff.setContactNumber(request.getContactNumber());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setRole(request.getRole());
        staff.setDepartment(department);
        staff.setDesignation(request.getDesignation());
        if (request.getAccessLevel() != null) {
            staff.setAccessLevel(request.getAccessLevel());
        }
        if (request.getStatus() != null) {
            staff.setStatus(request.getStatus());
        }
        if (request.getPhotoUrl() != null) {
            staff.setPhotoUrl(request.getPhotoUrl());
        }

        Staff savedStaff = staffRepository.save(staff);

        // Update corresponding User record
        User user = userRepository.findByEmail(staff.getEmail())
                .or(() -> userRepository.findByStaffId(staff.getStaffId()))
                .orElse(null);
        if (user != null) {
            user.setFullName(request.getFullName());
            user.setContactNumber(request.getContactNumber());
            user.setDateOfBirth(request.getDateOfBirth());
            user.setRoles(Set.of(request.getRole()));
            user.setDepartment(department != null ? department.getName() : request.getDepartment());
            user.setDesignation(request.getDesignation());
            if (request.getAccessLevel() != null) {
                user.setAccessLevel(request.getAccessLevel());
            }
            if (request.getStatus() != null) {
                user.setStatus(request.getStatus());
            }
            if (request.getPhotoUrl() != null) {
                user.setPhotoUrl(request.getPhotoUrl());
            }
            user = userRepository.save(user);

            // Lifecycle event for downstream synchronization
            String lifecyclePayload = """
                {
                  "eventId": "%s",
                  "eventType": "STAFF_UPDATED",
                  "staffId": "%s",
                  "oldRole": "%s",
                  "newRole": "%s",
                  "status": "%s",
                  "timestamp": "%s"
                }
                """.formatted(
                    UUID.randomUUID().toString(),
                    staff.getStaffId(),
                    oldRole != null ? oldRole.name() : "UNKNOWN",
                    request.getRole().name(),
                    staff.getStatus().name(),
                    LocalDateTime.now()
            );
            outboxEventRepository.save(new OutboxEvent("staff.lifecycle", staff.getStaffId(), lifecyclePayload));
        }

        return mapToStaffResponse(savedStaff, user);
    }

    public StaffResponse mapToStaffResponse(Staff staff, User user) {
        String deptName = staff.getDepartment() != null ? staff.getDepartment().getName() : null;
        Long reportingToId = user != null && user.getReportingTo() != null ? user.getReportingTo().getId() : null;
        String reportingToName = user != null && user.getReportingTo() != null ? user.getReportingTo().getFullName() : null;
        String badgeToken = user != null ? user.getBadgeToken() : null;
        int badgeVersion = user != null ? user.getBadgeVersion() : 1;

        return new StaffResponse(
                staff.getId(),
                staff.getStaffId(),
                staff.getFullName(),
                staff.getEmail(),
                staff.getContactNumber(),
                staff.getDateOfBirth(),
                staff.getRole(),
                deptName,
                staff.getDesignation(),
                reportingToId,
                reportingToName,
                staff.getAccessLevel(),
                staff.getLoginMethod(),
                badgeToken,
                badgeVersion,
                staff.getStatus(),
                staff.getCreatedAt(),
                staff.getPhotoUrl(),
                staff.getCreatedByStaffId()
        );
    }

    public StaffListItemResponse mapToStaffListItemResponse(Staff staff) {
        String deptName = staff.getDepartment() != null ? staff.getDepartment().getName() : null;

        return new StaffListItemResponse(
                staff.getId(),
                staff.getStaffId(),
                staff.getFullName(),
                staff.getEmail(),
                staff.getRole(),
                deptName,
                staff.getDesignation(),
                staff.getStatus(),
                staff.getCreatedAt(),
                staff.getPhotoUrl(),
                staff.getCreatedByStaffId()
        );
    }
}
