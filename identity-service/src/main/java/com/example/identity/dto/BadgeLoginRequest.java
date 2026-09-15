package com.example.identity.dto;

import jakarta.validation.constraints.NotBlank;

public class BadgeLoginRequest {

    @NotBlank(message = "Staff ID is required")
    private String staffId;

    @NotBlank(message = "Badge token is required")
    private String badgeToken;

    public BadgeLoginRequest() {
    }

    public BadgeLoginRequest(String staffId, String badgeToken) {
        this.staffId = staffId;
        this.badgeToken = badgeToken;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getBadgeToken() {
        return badgeToken;
    }

    public void setBadgeToken(String badgeToken) {
        this.badgeToken = badgeToken;
    }
}
