package com.example.identity.dto;

import com.example.identity.entity.type.AccessLevelType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class UpdateStaffRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String contactNumber;

    private LocalDate dateOfBirth;

    @NotNull(message = "Role is required")
    private RoleType role;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private Long reportingToId;

    private AccessLevelType accessLevel;

    private StaffStatusType status;

    private String photoUrl;

    public UpdateStaffRequest() {
    }

    public UpdateStaffRequest(String fullName, String contactNumber, LocalDate dateOfBirth, RoleType role, String department, String designation, Long reportingToId, AccessLevelType accessLevel, StaffStatusType status, String photoUrl) {
        this.fullName = fullName;
        this.contactNumber = contactNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.reportingToId = reportingToId;
        this.accessLevel = accessLevel;
        this.status = status;
        this.photoUrl = photoUrl;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getReportingToId() {
        return reportingToId;
    }

    public void setReportingToId(Long reportingToId) {
        this.reportingToId = reportingToId;
    }

    public AccessLevelType getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevelType accessLevel) {
        this.accessLevel = accessLevel;
    }

    public StaffStatusType getStatus() {
        return status;
    }

    public void setStatus(StaffStatusType status) {
        this.status = status;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
