package com.example.doctor.dto;

public class OnBoardNewDoctorDto {
    private Long userId;
    private String name;
    private String specialization;
    private String email;

    public OnBoardNewDoctorDto() {
    }

    public OnBoardNewDoctorDto(Long userId, String name, String specialization, String email) {
        this.userId = userId;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
