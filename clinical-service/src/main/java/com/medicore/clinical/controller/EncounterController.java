package com.medicore.clinical.controller;

import com.medicore.clinical.dto.EncounterDtos.*;
import com.medicore.clinical.service.EncounterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clinical/encounters")
@RequiredArgsConstructor
public class EncounterController {

    private final EncounterService encounterService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<EncounterResponse> createEncounter(@Valid @RequestBody CreateEncounterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(encounterService.createEncounter(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<EncounterResponse> getEncounterById(@PathVariable UUID id) {
        return ResponseEntity.ok(encounterService.getEncounterById(id));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<EncounterResponse>> getEncountersByPatientId(@PathVariable UUID patientId) {
        return ResponseEntity.ok(encounterService.getEncountersByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<EncounterResponse>> getEncountersByDoctorId(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(encounterService.getEncountersByDoctorId(doctorId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<EncounterResponse> updateEncounterStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEncounterStatusRequest request) {
        return ResponseEntity.ok(encounterService.updateEncounterStatus(id, request));
    }
}
