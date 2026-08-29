package com.example.insurance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance")
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String policyNumber;

    @Column(nullable = false, length = 100)
    private String provider;

    @Column(nullable = false)
    private LocalDate validUntil;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "patient_id")
    private Long patientId;

    public Insurance() {
    }

    public Insurance(Long id, String policyNumber, String provider, LocalDate validUntil, LocalDateTime createdAt, Long patientId) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.provider = provider;
        this.validUntil = validUntil;
        this.createdAt = createdAt;
        this.patientId = patientId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String policyNumber;
        private String provider;
        private LocalDate validUntil;
        private LocalDateTime createdAt;
        private Long patientId;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder policyNumber(String policyNumber) {
            this.policyNumber = policyNumber;
            return this;
        }

        public Builder provider(String provider) {
            this.provider = provider;
            return this;
        }

        public Builder validUntil(LocalDate validUntil) {
            this.validUntil = validUntil;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder patientId(Long patientId) {
            this.patientId = patientId;
            return this;
        }

        public Insurance build() {
            return new Insurance(id, policyNumber, provider, validUntil, createdAt, patientId);
        }
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
