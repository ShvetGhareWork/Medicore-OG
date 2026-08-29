package com.example.patient.dto;

import java.io.Serializable;

public class PatientCreatedEvent implements Serializable {
    private Long patientId;
    private String firstName;
    private String lastName;
    private String email;

    public PatientCreatedEvent() {
    }

    public PatientCreatedEvent(Long patientId, String firstName, String lastName, String email) {
        this.patientId = patientId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
