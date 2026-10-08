package com.medicore.clinical.controller;

import com.medicore.clinical.dto.NurseFlagDtos.*;
import com.medicore.clinical.service.NurseFlagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clinical/flags")
@RequiredArgsConstructor
public class NurseFlagController {

    private final NurseFlagService flagService;

    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<NurseFlagResponse> createFlag(@Valid @RequestBody CreateNurseFlagRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flagService.createFlag(request));
    }

    @PostMapping("/{id}/acknowledge")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<NurseFlagResponse> acknowledgeFlag(@PathVariable UUID id) {
        return ResponseEntity.ok(flagService.acknowledgeFlag(id));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<NurseFlagResponse> resolveFlag(
            @PathVariable UUID id,
            @RequestBody(required = false) ResolveNurseFlagRequest request) {
        return ResponseEntity.ok(flagService.resolveFlag(id, request));
    }

    @GetMapping("/patient/{patientId}/open")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<NurseFlagResponse>> getOpenFlagsByPatientId(@PathVariable UUID patientId) {
        return ResponseEntity.ok(flagService.getOpenFlagsByPatientId(patientId));
    }

    @GetMapping("/encounter/{encounterId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<NurseFlagResponse>> getFlagsByEncounterId(@PathVariable UUID encounterId) {
        return ResponseEntity.ok(flagService.getFlagsByEncounterId(encounterId));
    }
}
