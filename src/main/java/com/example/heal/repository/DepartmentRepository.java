package com.example.heal.repository;

import com.example.heal.dto.DoctorResponseDto;
import com.example.heal.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
