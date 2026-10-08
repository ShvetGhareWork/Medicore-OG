package com.medicore.clinical.controller;

import com.medicore.clinical.dto.ClinicalOverviewDto;
import com.medicore.clinical.service.ClinicalOverviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/clinical/overview")
@RequiredArgsConstructor
public class ClinicalOverviewController {

    private final ClinicalOverviewService overviewService;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<ClinicalOverviewDto> getPatientOverview(@PathVariable UUID patientId) {
        return ResponseEntity.ok(overviewService.getPatientOverview(patientId));
    }
}
