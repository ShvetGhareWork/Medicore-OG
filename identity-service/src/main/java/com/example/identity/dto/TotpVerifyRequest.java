package com.example.identity.dto;

import jakarta.validation.constraints.NotBlank;

public class TotpVerifyRequest {

    @NotBlank(message = "Temporary token or username is required")
    private String tempToken;

    @NotBlank(message = "6-digit TOTP code is required")
    private String totpCode;

    public TotpVerifyRequest() {
    }

    public TotpVerifyRequest(String tempToken, String totpCode) {
        this.tempToken = tempToken;
        this.totpCode = totpCode;
    }

    public String getTempToken() {
        return tempToken;
    }

    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }

    public String getTotpCode() {
        return totpCode;
    }

    public void setTotpCode(String totpCode) {
        this.totpCode = totpCode;
    }
}
