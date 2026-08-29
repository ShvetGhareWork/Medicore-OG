package com.example.insurance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InsuranceResponseDto {
    private Long id;
    private String policyNumber;
    private String provider;
    private LocalDate validUntil;
    private LocalDateTime createdAt;
    private Long patientId;

    public InsuranceResponseDto() {
    }

    public InsuranceResponseDto(Long id, String policyNumber, String provider, LocalDate validUntil, LocalDateTime createdAt, Long patientId) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.provider = provider;
        this.validUntil = validUntil;
        this.createdAt = createdAt;
        this.patientId = patientId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
}
