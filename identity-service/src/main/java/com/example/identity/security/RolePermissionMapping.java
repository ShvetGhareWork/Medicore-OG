package com.example.identity.security;

import com.example.identity.entity.type.PermissionType;
import com.example.identity.entity.type.RoleType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.identity.entity.type.PermissionType.*;
import static com.example.identity.entity.type.RoleType.*;

public class RolePermissionMapping {

    private static final Map<RoleType, Set<PermissionType>> map = Map.of(
            PATIENT, Set.of(PATIENT_READ, APPOINTMENT_READ, APPOINTMENT_WRITE),
            DOCTOR, Set.of(APPOINTMENT_DELETE, APPOINTMENT_WRITE, APPOINTMENT_READ, PATIENT_READ),
            ADMIN, Set.of(PATIENT_READ, PATIENT_WRITE, APPOINTMENT_READ, APPOINTMENT_WRITE, APPOINTMENT_DELETE, USER_MANAGE, REPORT_VIEW),
            NURSE, Set.of(PATIENT_READ, APPOINTMENT_READ, APPOINTMENT_WRITE),
            PATHOLOGIST, Set.of(PATIENT_READ, REPORT_VIEW),
            INSURANCE_COORDINATOR, Set.of(PATIENT_READ, REPORT_VIEW),
            ADMINISTRATIVE, Set.of(PATIENT_READ, APPOINTMENT_READ, APPOINTMENT_WRITE),
            LAB_TECHNICIAN, Set.of(PATIENT_READ, REPORT_VIEW)
    );

    public static Set<SimpleGrantedAuthority> getAuthoritiesForRole(RoleType role) {
        Set<PermissionType> permissions = map.get(role);
        if (permissions == null) {
            return Set.of();
        }
        return permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toSet());
    }
}
