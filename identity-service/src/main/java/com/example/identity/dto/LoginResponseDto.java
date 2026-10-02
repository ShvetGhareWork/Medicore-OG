package com.example.identity.dto;

import java.util.List;

public class LoginResponseDto {
    private String jwt;
    private Long id;
    private String fullName;
    private String email;
    private String username;
    private String staffId;
    private List<String> roles;
    private boolean mfaRequired = false;
    private String tempToken;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String jwt, Long id) {
        this.jwt = jwt;
        this.id = id;
        this.mfaRequired = false;
    }

    public LoginResponseDto(String jwt, Long id, String fullName, String email, String username, String staffId, List<String> roles) {
        this.jwt = jwt;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.username = username;
        this.staffId = staffId;
        this.roles = roles;
        this.mfaRequired = false;
    }

    public LoginResponseDto(boolean mfaRequired, String tempToken) {
        this.mfaRequired = mfaRequired;
        this.tempToken = tempToken;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public boolean isMfaRequired() {
        return mfaRequired;
    }

    public void setMfaRequired(boolean mfaRequired) {
        this.mfaRequired = mfaRequired;
    }

    public String getTempToken() {
        return tempToken;
    }

    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }
}
