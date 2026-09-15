package com.example.identity.service;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffListItemResponse;
import com.example.identity.dto.StaffResponse;
import com.example.identity.entity.User;
import com.example.identity.entity.type.*;
import com.example.identity.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public StaffService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

        List<String> existingStaffIds = userRepository.findStaffIdsForPrefixWithLock(pattern);

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
        if (userRepository.findByUsername(request.getEmail()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists");
        }

        User reportingTo = null;
        if (request.getReportingToId() != null) {
            reportingTo = userRepository.findById(request.getReportingToId())
                    .orElseThrow(() -> new IllegalArgumentException("Reporting manager not found with ID: " + request.getReportingToId()));
        }

        String staffId = generateStaffId(request.getRole());
        String badgeToken = generateBadgeToken();

        LoginMethodType loginMethod = request.getLoginMethod() != null ? request.getLoginMethod() : LoginMethodType.BADGE_QR;
        String hashedPassword = null;
        if (loginMethod == LoginMethodType.PASSWORD && request.getTemporaryPassword() != null && !request.getTemporaryPassword().isBlank()) {
            hashedPassword = passwordEncoder.encode(request.getTemporaryPassword());
        }

        AccessLevelType accessLevel = request.getAccessLevel() != null ? request.getAccessLevel() : AccessLevelType.STANDARD;

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(hashedPassword)
                .providerType(AuthProviderType.EMAIL)
                .roles(Set.of(request.getRole()))
                .staffId(staffId)
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .dateOfBirth(request.getDateOfBirth())
                .contactNumber(request.getContactNumber())
                .photoUrl(request.getPhotoUrl())
                .reportingTo(reportingTo)
                .accessLevel(accessLevel)
                .loginMethod(loginMethod)
                .badgeToken(badgeToken)
                .badgeVersion(1)
                .status(StaffStatusType.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        return mapToStaffResponse(savedUser);
    }

    public Page<StaffListItemResponse> getStaffList(RoleType role, String department, StaffStatusType status, String search, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only staff users
            predicates.add(cb.isNotNull(root.get("staffId")));

            if (role != null) {
                Join<User, RoleType> rolesJoin = root.join("roles");
                predicates.add(cb.equal(rolesJoin, role));
            }

            if (department != null && !department.isBlank() && !"All Departments".equalsIgnoreCase(department)) {
                predicates.add(cb.like(cb.lower(root.get("department")), "%" + department.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
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

        Page<User> page = userRepository.findAll(spec, pageable);
        return page.map(this::mapToStaffListItemResponse);
    }

    public StaffResponse getStaffById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        if (user.getStaffId() == null) {
            throw new IllegalArgumentException("User with ID " + id + " is not a staff member");
        }
        return mapToStaffResponse(user);
    }

    @Transactional
    public StaffResponse deactivateStaff(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        if (user.getStaffId() == null) {
            throw new IllegalArgumentException("User with ID " + id + " is not a staff member");
        }
        user.setStatus(StaffStatusType.INACTIVE);
        user.setBadgeVersion(user.getBadgeVersion() + 1);
        User savedUser = userRepository.save(user);
        return mapToStaffResponse(savedUser);
    }

    public StaffResponse mapToStaffResponse(User user) {
        RoleType primaryRole = user.getRoles() != null && !user.getRoles().isEmpty()
                ? user.getRoles().iterator().next()
                : null;

        Long reportingToId = user.getReportingTo() != null ? user.getReportingTo().getId() : null;
        String reportingToName = user.getReportingTo() != null ? user.getReportingTo().getFullName() : null;

        return new StaffResponse(
                user.getId(),
                user.getStaffId(),
                user.getFullName(),
                user.getEmail(),
                user.getContactNumber(),
                user.getDateOfBirth(),
                primaryRole,
                user.getDepartment(),
                user.getDesignation(),
                reportingToId,
                reportingToName,
                user.getAccessLevel(),
                user.getLoginMethod(),
                user.getBadgeToken(),
                user.getBadgeVersion(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getPhotoUrl()
        );
    }

    public StaffListItemResponse mapToStaffListItemResponse(User user) {
        RoleType primaryRole = user.getRoles() != null && !user.getRoles().isEmpty()
                ? user.getRoles().iterator().next()
                : null;

        return new StaffListItemResponse(
                user.getId(),
                user.getStaffId(),
                user.getFullName(),
                user.getEmail(),
                primaryRole,
                user.getDepartment(),
                user.getDesignation(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getPhotoUrl()
        );
    }
}
