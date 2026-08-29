package com.example.department.dto;

public class CreateDepartmentDto {
    private String name;
    private Long headDoctorId;

    public CreateDepartmentDto() {
    }

    public CreateDepartmentDto(String name, Long headDoctorId) {
        this.name = name;
        this.headDoctorId = headDoctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getHeadDoctorId() {
        return headDoctorId;
    }

    public void setHeadDoctorId(Long headDoctorId) {
        this.headDoctorId = headDoctorId;
    }
}
