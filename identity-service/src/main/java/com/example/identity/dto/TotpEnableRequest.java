package com.example.identity.dto;

import jakarta.validation.constraints.NotBlank;

public class TotpEnableRequest {

    @NotBlank(message = "Secret key is required")
    private String secretKey;

    @NotBlank(message = "6-digit confirmation code is required")
    private String totpCode;

    public TotpEnableRequest() {
    }

    public TotpEnableRequest(String secretKey, String totpCode) {
        this.secretKey = secretKey;
        this.totpCode = totpCode;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getTotpCode() {
        return totpCode;
    }

    public void setTotpCode(String totpCode) {
        this.totpCode = totpCode;
    }
}
