package com.example.identity.controllers;

import com.example.identity.dto.CreatePatientRequest;
import com.example.identity.dto.PatientResponse;
import com.example.identity.entity.type.AdmissionStatusType;
import com.example.identity.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/patients")
@PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PATHOLOGIST', 'INSURANCE_COORDINATOR', 'ADMINISTRATIVE')")
public class PatientAdminController {

    private final PatientService patientService;

    public PatientAdminController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody CreatePatientRequest request) {
        PatientResponse response = patientService.createPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<PatientResponse>> getPatients(
            @RequestParam(required = false) AdmissionStatusType status,
            @RequestParam(required = false) String ward,
            @RequestParam(required = false) Long attendingDoctorId,
            @RequestParam(required = false) String attendingDoctor,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PatientResponse> response = patientService.getPatients(status, ward, attendingDoctorId, attendingDoctor, search, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-patients")
    public ResponseEntity<Page<PatientResponse>> getMyPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(patientService.getMyPatients(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/by-code/{patientId}")
    public ResponseEntity<PatientResponse> getPatientByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientByPatientId(patientId));
    }
}
