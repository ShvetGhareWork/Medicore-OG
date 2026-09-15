package com.example.identity.dto;

import com.example.identity.entity.type.AccessLevelType;
import com.example.identity.entity.type.LoginMethodType;
import com.example.identity.entity.type.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CreateStaffRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

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

    private LoginMethodType loginMethod;

    private String temporaryPassword;

    private String photoUrl;

    public CreateStaffRequest() {
    }

    public CreateStaffRequest(String fullName, String email, String contactNumber, LocalDate dateOfBirth, RoleType role, String department, String designation, Long reportingToId, AccessLevelType accessLevel, LoginMethodType loginMethod, String temporaryPassword, String photoUrl) {
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.reportingToId = reportingToId;
        this.accessLevel = accessLevel;
        this.loginMethod = loginMethod;
        this.temporaryPassword = temporaryPassword;
        this.photoUrl = photoUrl;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public LoginMethodType getLoginMethod() {
        return loginMethod;
    }

    public void setLoginMethod(LoginMethodType loginMethod) {
        this.loginMethod = loginMethod;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
