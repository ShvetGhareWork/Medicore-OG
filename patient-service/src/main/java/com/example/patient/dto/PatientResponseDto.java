package com.example.patient.dto;

import com.example.patient.entity.type.BloodGroupType;

import java.time.LocalDate;

public class PatientResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String name;
    private String email;
    private String gender;
    private LocalDate birthDate;
    private BloodGroupType bloodGroup;
    private Long userId;

    public PatientResponseDto() {
    }

    public PatientResponseDto(Long id, String firstName, String lastName, String name, String email, String gender, LocalDate birthDate, BloodGroupType bloodGroup, Long userId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = name != null ? name : (firstName != null ? firstName + (lastName != null ? " " + lastName : "") : "");
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
        this.bloodGroup = bloodGroup;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        if (this.name == null && firstName != null) {
            this.name = firstName + (lastName != null ? " " + lastName : "");
        }
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        if (firstName != null) {
            this.name = firstName + (lastName != null ? " " + lastName : "");
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public BloodGroupType getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroupType bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
