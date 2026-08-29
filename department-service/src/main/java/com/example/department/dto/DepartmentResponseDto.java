package com.example.department.dto;

import java.util.HashSet;
import java.util.Set;

public class DepartmentResponseDto {
    private Long id;
    private String name;
    private Long headDoctorId;
    private Set<Long> doctorIds = new HashSet<>();

    public DepartmentResponseDto() {
    }

    public DepartmentResponseDto(Long id, String name, Long headDoctorId, Set<Long> doctorIds) {
        this.id = id;
        this.name = name;
        this.headDoctorId = headDoctorId;
        this.doctorIds = doctorIds != null ? doctorIds : new HashSet<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Set<Long> getDoctorIds() {
        return doctorIds;
    }

    public void setDoctorIds(Set<Long> doctorIds) {
        this.doctorIds = doctorIds;
    }
}
