package com.example.identity.dto;

public class LoginResponseDto {
    private String jwt;
    private Long id;
    private boolean mfaRequired = false;
    private String tempToken;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String jwt, Long id) {
        this.jwt = jwt;
        this.id = id;
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
