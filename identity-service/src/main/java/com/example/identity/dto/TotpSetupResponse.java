package com.example.identity.dto;

public class TotpSetupResponse {
    private String secretKey;
    private String qrCodeUri;
    private String accountName;

    public TotpSetupResponse() {
    }

    public TotpSetupResponse(String secretKey, String qrCodeUri, String accountName) {
        this.secretKey = secretKey;
        this.qrCodeUri = qrCodeUri;
        this.accountName = accountName;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getQrCodeUri() {
        return qrCodeUri;
    }

    public void setQrCodeUri(String qrCodeUri) {
        this.qrCodeUri = qrCodeUri;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
}
