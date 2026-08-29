package com.example.department.service;

import com.example.department.dto.CreateDepartmentDto;
import com.example.department.dto.DepartmentResponseDto;
import com.example.department.entity.Department;
import com.example.department.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    public DepartmentService(DepartmentRepository departmentRepository, ModelMapper modelMapper) {
        this.departmentRepository = departmentRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(dept -> modelMapper.map(dept, DepartmentResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponseDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
        return modelMapper.map(department, DepartmentResponseDto.class);
    }

    @Transactional
    public DepartmentResponseDto createDepartment(CreateDepartmentDto createDepartmentDto) {
        if (departmentRepository.findByName(createDepartmentDto.getName()).isPresent()) {
            throw new IllegalStateException("Department with name " + createDepartmentDto.getName() + " already exists");
        }

        Department department = Department.builder()
                .name(createDepartmentDto.getName())
                .headDoctorId(createDepartmentDto.getHeadDoctorId())
                .doctorIds(new HashSet<>())
                .build();

        if (createDepartmentDto.getHeadDoctorId() != null) {
            department.getDoctorIds().add(createDepartmentDto.getHeadDoctorId());
        }

        Department saved = departmentRepository.save(department);
        return modelMapper.map(saved, DepartmentResponseDto.class);
    }

    @Transactional
    public DepartmentResponseDto assignDoctorToDepartment(Long departmentId, Long doctorId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + departmentId));

        department.getDoctorIds().add(doctorId);
        Department saved = departmentRepository.save(department);
        return modelMapper.map(saved, DepartmentResponseDto.class);
    }

    @Transactional
    public DepartmentResponseDto setHeadDoctor(Long departmentId, Long doctorId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + departmentId));

        department.setHeadDoctorId(doctorId);
        department.getDoctorIds().add(doctorId);
        Department saved = departmentRepository.save(department);
        return modelMapper.map(saved, DepartmentResponseDto.class);
    }
}
