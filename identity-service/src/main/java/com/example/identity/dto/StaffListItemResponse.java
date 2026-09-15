package com.example.identity.dto;

import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;

import java.time.LocalDateTime;

public class StaffListItemResponse {
    private Long id;
    private String staffId;
    private String fullName;
    private String email;
    private RoleType role;
    private String department;
    private String designation;
    private StaffStatusType status;
    private LocalDateTime createdAt;
    private String photoUrl;

    public StaffListItemResponse() {
    }

    public StaffListItemResponse(Long id, String staffId, String fullName, String email, RoleType role, String department, String designation, StaffStatusType status, LocalDateTime createdAt, String photoUrl) {
        this.id = id;
        this.staffId = staffId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.status = status;
        this.createdAt = createdAt;
        this.photoUrl = photoUrl;
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
}
