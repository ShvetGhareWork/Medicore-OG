package com.example.appointment.dto;

public class DoctorResponseDto {
    private Long id;
    private Long userId;
    private String name;
    private String specialization;
    private String email;

    public DoctorResponseDto() {
    }

    public DoctorResponseDto(Long id, String name, String specialization, String email) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
    }

    public DoctorResponseDto(Long id, Long userId, String name, String specialization, String email) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
