package com.example.insurance.dto;

import java.time.LocalDate;

public class InsuranceRequestDto {
    private String policyNumber;
    private String provider;
    private LocalDate validUntil;
    private Long patientId;

    public InsuranceRequestDto() {
    }

    public InsuranceRequestDto(String policyNumber, String provider, LocalDate validUntil, Long patientId) {
        this.policyNumber = policyNumber;
        this.provider = provider;
        this.validUntil = validUntil;
        this.patientId = patientId;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
}
