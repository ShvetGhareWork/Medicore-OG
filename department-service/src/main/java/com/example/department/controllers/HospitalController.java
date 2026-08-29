package com.example.department.controllers;

import com.example.department.dto.CreateDepartmentDto;
import com.example.department.dto.DepartmentResponseDto;
import com.example.department.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class HospitalController {

    private final DepartmentService departmentService;

    public HospitalController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponseDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<DepartmentResponseDto> getDepartmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponseDto> createDepartment(@RequestBody CreateDepartmentDto createDepartmentDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(createDepartmentDto));
    }

    @PostMapping("/departments/{departmentId}/doctors/{doctorId}")
    public ResponseEntity<DepartmentResponseDto> assignDoctorToDepartment(
            @PathVariable("departmentId") Long departmentId,
            @PathVariable("doctorId") Long doctorId
    ) {
        return ResponseEntity.ok(departmentService.assignDoctorToDepartment(departmentId, doctorId));
    }

    @PutMapping("/departments/{departmentId}/head/{doctorId}")
    public ResponseEntity<DepartmentResponseDto> setHeadDoctor(
            @PathVariable("departmentId") Long departmentId,
            @PathVariable("doctorId") Long doctorId
    ) {
        return ResponseEntity.ok(departmentService.setHeadDoctor(departmentId, doctorId));
    }

    // Retain compatibility with legacy endpoint /public/departments
    @GetMapping("/public/departments")
    public ResponseEntity<List<DepartmentResponseDto>> getPublicDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
}
