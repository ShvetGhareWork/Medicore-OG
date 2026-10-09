package com.example.identity.dto;

import com.example.identity.entity.type.AccessLevelType;
import com.example.identity.entity.type.LoginMethodType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StaffResponse {
    private Long id;
    private String staffId;
    private String fullName;
    private String email;
    private String contactNumber;
    private LocalDate dateOfBirth;
    private RoleType role;
    private String department;
    private String designation;
    private Long reportingToId;
    private String reportingToName;
    private AccessLevelType accessLevel;
    private LoginMethodType loginMethod;
    private String badgeToken;
    private int badgeVersion;
    private StaffStatusType status;
    private LocalDateTime createdAt;
    private String photoUrl;
    private String createdByStaffId;

    public StaffResponse() {
    }

    public StaffResponse(Long id, String staffId, String fullName, String email, String contactNumber, LocalDate dateOfBirth, RoleType role, String department, String designation, Long reportingToId, String reportingToName, AccessLevelType accessLevel, LoginMethodType loginMethod, String badgeToken, int badgeVersion, StaffStatusType status, LocalDateTime createdAt, String photoUrl) {
        this(id, staffId, fullName, email, contactNumber, dateOfBirth, role, department, designation, reportingToId, reportingToName, accessLevel, loginMethod, badgeToken, badgeVersion, status, createdAt, photoUrl, null);
    }

    public StaffResponse(Long id, String staffId, String fullName, String email, String contactNumber, LocalDate dateOfBirth, RoleType role, String department, String designation, Long reportingToId, String reportingToName, AccessLevelType accessLevel, LoginMethodType loginMethod, String badgeToken, int badgeVersion, StaffStatusType status, LocalDateTime createdAt, String photoUrl, String createdByStaffId) {
        this.id = id;
        this.staffId = staffId;
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.reportingToId = reportingToId;
        this.reportingToName = reportingToName;
        this.accessLevel = accessLevel;
        this.loginMethod = loginMethod;
        this.badgeToken = badgeToken;
        this.badgeVersion = badgeVersion;
        this.status = status;
        this.createdAt = createdAt;
        this.photoUrl = photoUrl;
        this.createdByStaffId = createdByStaffId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
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

    public String getReportingToName() {
        return reportingToName;
    }

    public void setReportingToName(String reportingToName) {
        this.reportingToName = reportingToName;
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

    public String getBadgeToken() {
        return badgeToken;
    }

    public void setBadgeToken(String badgeToken) {
        this.badgeToken = badgeToken;
    }

    public int getBadgeVersion() {
        return badgeVersion;
    }

    public void setBadgeVersion(int badgeVersion) {
        this.badgeVersion = badgeVersion;
    }

    public StaffStatusType getStatus() {
        return status;
    }

    public void setStatus(StaffStatusType status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getCreatedByStaffId() {
        return createdByStaffId;
    }

    public void setCreatedByStaffId(String createdByStaffId) {
        this.createdByStaffId = createdByStaffId;
    }
}
