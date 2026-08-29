package com.example.patient.controllers;

import com.example.patient.dto.BloodGroupCountResponseEntity;
import com.example.patient.dto.CreatePatientRequestDto;
import com.example.patient.dto.PatientResponseDto;
import com.example.patient.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDto> getPatientById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping
    public ResponseEntity<List<PatientResponseDto>> getAllPatients(
            @RequestParam(value = "page", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "size", defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok(patientService.getAllPatients(pageNumber, pageSize));
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDto> getPatientProfile(@RequestParam(value = "id", defaultValue = "1") Long patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @GetMapping("/blood-groups")
    public ResponseEntity<List<BloodGroupCountResponseEntity>> getBloodGroupCounts() {
        return ResponseEntity.ok(patientService.getBloodGroupCounts());
    }

    @PostMapping
    public ResponseEntity<PatientResponseDto> createPatient(@RequestBody CreatePatientRequestDto createPatientRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(createPatientRequestDto));
    }
}
