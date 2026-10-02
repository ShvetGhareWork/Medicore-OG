package com.example.identity.service;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffListItemResponse;
import com.example.identity.dto.StaffResponse;
import com.example.identity.entity.Department;
import com.example.identity.entity.Staff;
import com.example.identity.entity.User;
import com.example.identity.entity.type.*;
import com.example.identity.repository.DepartmentRepository;
import com.example.identity.repository.StaffRepository;
import com.example.identity.repository.UserRepository;
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

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public StaffService(StaffRepository staffRepository, DepartmentRepository departmentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
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

        userRepository.save(user);

        return mapToStaffResponse(savedStaff, user);
    }

    public Page<StaffListItemResponse> getStaffList(RoleType role, String department, StaffStatusType status, String search, Pageable pageable) {
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

    public StaffResponse getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        User user = userRepository.findByEmail(staff.getEmail()).orElse(null);
        return mapToStaffResponse(staff, user);
    }

    @Transactional
    public StaffResponse deactivateStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found with ID: " + id));
        staff.setStatus(StaffStatusType.INACTIVE);
        Staff savedStaff = staffRepository.save(staff);

        User user = userRepository.findByEmail(staff.getEmail()).orElse(null);
        if (user != null) {
            user.setStatus(StaffStatusType.INACTIVE);
            user.setBadgeVersion(user.getBadgeVersion() + 1);
            userRepository.save(user);
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
                staff.getPhotoUrl()
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
                staff.getPhotoUrl()
        );
    }
}
