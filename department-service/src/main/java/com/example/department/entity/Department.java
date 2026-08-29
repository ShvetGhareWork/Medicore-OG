package com.example.department.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    private Long headDoctorId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "dept_doctors", joinColumns = @JoinColumn(name = "dept_id"))
    @Column(name = "doctor_id")
    private Set<Long> doctorIds = new HashSet<>();

    public Department() {
    }

    public Department(Long id, String name, Long headDoctorId, Set<Long> doctorIds) {
        this.id = id;
        this.name = name;
        this.headDoctorId = headDoctorId;
        this.doctorIds = doctorIds != null ? doctorIds : new HashSet<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Long headDoctorId;
        private Set<Long> doctorIds = new HashSet<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder headDoctorId(Long headDoctorId) {
            this.headDoctorId = headDoctorId;
            return this;
        }

        public Builder doctorIds(Set<Long> doctorIds) {
            this.doctorIds = doctorIds;
            return this;
        }

        public Department build() {
            return new Department(id, name, headDoctorId, doctorIds);
        }
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
