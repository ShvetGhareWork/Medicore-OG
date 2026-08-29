package com.example.identity.entity.type;

public enum PermissionType {
    PATIENT_READ("patient:read"),
    PATIENT_WRITE("patient:write"),
    APPOINTMENT_READ("appointment:read"),
    APPOINTMENT_WRITE("appointment:write"),
    APPOINTMENT_DELETE("appointment:delete"),
    USER_MANAGE("user:manage"),
    REPORT_VIEW("report:view");

    private final String permission;

    PermissionType(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return this.permission;
    }
}
