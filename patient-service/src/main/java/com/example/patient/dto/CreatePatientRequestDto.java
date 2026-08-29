package com.example.patient.dto;

import com.example.patient.entity.type.BloodGroupType;

import java.time.LocalDate;

public class CreatePatientRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private LocalDate birthDate;
    private BloodGroupType bloodGroupType;
    private Long userId;

    public CreatePatientRequestDto() {
    }

    public CreatePatientRequestDto(String firstName, String lastName, String email, String gender, LocalDate birthDate, BloodGroupType bloodGroupType, Long userId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
        this.bloodGroupType = bloodGroupType;
        this.userId = userId;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public BloodGroupType getBloodGroupType() {
        return bloodGroupType;
    }

    public void setBloodGroupType(BloodGroupType bloodGroupType) {
        this.bloodGroupType = bloodGroupType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
