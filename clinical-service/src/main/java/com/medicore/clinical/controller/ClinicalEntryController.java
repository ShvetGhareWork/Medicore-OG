package com.medicore.clinical.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicore.clinical.domain.enums.EntryType;
import com.medicore.clinical.dto.ClinicalEntryDtos.*;
import com.medicore.clinical.service.ClinicalEntryService;
import com.medicore.clinical.service.IdempotencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clinical/entries")
@RequiredArgsConstructor
@Slf4j
public class ClinicalEntryController {

    private final ClinicalEntryService entryService;
    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<ClinicalEntryResponse> createEntry(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody CreateClinicalEntryRequest request) {

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            String cached = idempotencyService.getCachedResponse(idempotencyKey);
            if (cached != null && !cached.equals("PROCESSING")) {
                try {
                    ClinicalEntryResponse cachedResponse = objectMapper.readValue(cached, ClinicalEntryResponse.class);
                    return ResponseEntity.ok(cachedResponse);
                } catch (Exception ignored) {}
            }
            idempotencyService.acquire(idempotencyKey, "PROCESSING");
        }

        ClinicalEntryResponse response = entryService.createEntry(request);

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            try {
                idempotencyService.updateResponse(idempotencyKey, objectMapper.writeValueAsString(response));
            } catch (Exception ignored) {}
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/sign")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<ClinicalEntryResponse> signEntry(@PathVariable UUID id) {
        return ResponseEntity.ok(entryService.signEntry(id));
    }

    @PostMapping("/{id}/amend")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<ClinicalEntryResponse> amendEntry(
            @PathVariable UUID id,
            @Valid @RequestBody AmendClinicalEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entryService.amendEntry(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<ClinicalEntryResponse> getEntryById(@PathVariable UUID id) {
        return ResponseEntity.ok(entryService.getEntryById(id));
    }

    @GetMapping("/{id}/audit-history")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<ClinicalEntryResponse>> getEntryAuditHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(entryService.getEntryAuditHistory(id));
    }

    @GetMapping("/encounter/{encounterId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<ClinicalEntryResponse>> getEntriesByEncounterId(@PathVariable UUID encounterId) {
        return ResponseEntity.ok(entryService.getEntriesByEncounterId(encounterId));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE', 'ADMIN')")
    public ResponseEntity<List<ClinicalEntryResponse>> getEntriesByPatientId(
            @PathVariable UUID patientId,
            @RequestParam(required = false) EntryType type) {
        if (type != null) {
            return ResponseEntity.ok(entryService.getEntriesByPatientAndType(patientId, type));
        }
        return ResponseEntity.ok(entryService.getEntriesByPatientId(patientId));
    }
}
