package com.medicore.clinical.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicore.clinical.domain.entity.ClinicalEntry;
import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.enums.AuditAction;
import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import com.medicore.clinical.dto.ClinicalEntryDtos.*;
import com.medicore.clinical.dto.ClinicalEventDto;
import com.medicore.clinical.repository.ClinicalEntryRepository;
import com.medicore.clinical.repository.EncounterRepository;
import com.medicore.clinical.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicalEntryService {

    private final ClinicalEntryRepository entryRepository;
    private final EncounterRepository encounterRepository;
    private final AuditService auditService;
    private final ClinicalEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    @Transactional
    public ClinicalEntryResponse createEntry(CreateClinicalEntryRequest request) {
        Encounter encounter = encounterRepository.findById(request.getEncounterId())
                .orElseThrow(() -> new NoSuchElementException("Encounter not found with ID: " + request.getEncounterId()));

        UUID authorId = SecurityUtils.getCurrentUserId();
        String authorName = SecurityUtils.getCurrentFullName();
        AuthorRole authorRole = SecurityUtils.hasRole("DOCTOR") ? AuthorRole.DOCTOR : AuthorRole.NURSE;

        String contentJsonStr = request.getContentJson() != null ? request.getContentJson().toString() : "{}";

        ClinicalEntry entry = ClinicalEntry.builder()
                .encounter(encounter)
                .patientId(request.getPatientId())
                .authorId(authorId != null ? authorId : encounter.getDoctorId())
                .authorName(authorName)
                .authorRole(authorRole)
                .entryType(request.getEntryType())
                .contentJson(contentJsonStr)
                .status(request.isAutoSign() ? EntryStatus.SIGNED : EntryStatus.DRAFT)
                .isCorrection(false)
                .build();

        if (request.isAutoSign()) {
            entry.setSignedAt(Instant.now());
            entry.setSignedById(authorId);
            entry.setSignedByName(authorName);
        }

        ClinicalEntry saved = entryRepository.save(entry);
        auditService.logAction(AuditAction.CREATE_ENTRY, "CLINICAL_ENTRY", saved.getId().toString(), saved.getPatientId(), "entryType=" + saved.getEntryType());

        if (saved.getStatus() == EntryStatus.SIGNED) {
            publishSignedEvent(saved);
        }

        return mapToResponse(saved);
    }

    @Transactional
    public ClinicalEntryResponse signEntry(UUID entryId) {
        ClinicalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new NoSuchElementException("Clinical entry not found with ID: " + entryId));

        if (entry.getStatus() == EntryStatus.SIGNED) {
            return mapToResponse(entry);
        }

        UUID signerId = SecurityUtils.getCurrentUserId();
        String signerName = SecurityUtils.getCurrentFullName();

        entry.setStatus(EntryStatus.SIGNED);
        entry.setSignedAt(Instant.now());
        entry.setSignedById(signerId);
        entry.setSignedByName(signerName);

        ClinicalEntry saved = entryRepository.save(entry);
        auditService.logAction(AuditAction.SIGN_ENTRY, "CLINICAL_ENTRY", saved.getId().toString(), saved.getPatientId(), "signedBy=" + signerName);

        publishSignedEvent(saved);
        return mapToResponse(saved);
    }

    @Transactional
    public ClinicalEntryResponse amendEntry(UUID originalEntryId, AmendClinicalEntryRequest request) {
        ClinicalEntry originalEntry = entryRepository.findById(originalEntryId)
                .orElseThrow(() -> new NoSuchElementException("Original clinical entry not found with ID: " + originalEntryId));

        UUID authorId = SecurityUtils.getCurrentUserId();
        String authorName = SecurityUtils.getCurrentFullName();
        AuthorRole authorRole = SecurityUtils.hasRole("DOCTOR") ? AuthorRole.DOCTOR : AuthorRole.NURSE;

        // Mark original as AMENDED (status flag only - content is never altered or deleted)
        originalEntry.setStatus(EntryStatus.AMENDED);
        entryRepository.save(originalEntry);

        String contentJsonStr = request.getContentJson() != null ? request.getContentJson().toString() : "{}";

        ClinicalEntry correctionEntry = ClinicalEntry.builder()
                .encounter(originalEntry.getEncounter())
                .patientId(originalEntry.getPatientId())
                .authorId(authorId != null ? authorId : originalEntry.getAuthorId())
                .authorName(authorName)
                .authorRole(authorRole)
                .entryType(originalEntry.getEntryType())
                .contentJson(contentJsonStr)
                .status(request.isAutoSign() ? EntryStatus.SIGNED : EntryStatus.DRAFT)
                .isCorrection(true)
                .originalEntryId(originalEntryId)
                .correctionReason(request.getCorrectionReason())
                .build();

        if (request.isAutoSign()) {
            correctionEntry.setSignedAt(Instant.now());
            correctionEntry.setSignedById(authorId);
            correctionEntry.setSignedByName(authorName);
        }

        ClinicalEntry savedCorrection = entryRepository.save(correctionEntry);
        auditService.logAction(AuditAction.AMEND_ENTRY, "CLINICAL_ENTRY", savedCorrection.getId().toString(), savedCorrection.getPatientId(), "originalEntryId=" + originalEntryId);

        if (savedCorrection.getStatus() == EntryStatus.SIGNED) {
            publishSignedEvent(savedCorrection);
        }

        return mapToResponse(savedCorrection);
    }

    @Transactional(readOnly = true)
    public ClinicalEntryResponse getEntryById(UUID id) {
        ClinicalEntry entry = entryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Clinical entry not found with ID: " + id));
        return mapToResponse(entry);
    }

    @Transactional(readOnly = true)
    public List<ClinicalEntryResponse> getEntriesByEncounterId(UUID encounterId) {
        return entryRepository.findByEncounterIdOrderByCreatedAtDesc(encounterId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClinicalEntryResponse> getEntriesByPatientId(UUID patientId) {
        return entryRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClinicalEntryResponse> getEntriesByPatientAndType(UUID patientId, EntryType entryType) {
        return entryRepository.findByPatientIdAndEntryTypeOrderByCreatedAtDesc(patientId, entryType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClinicalEntryResponse> getEntryAuditHistory(UUID entryId) {
        List<ClinicalEntryResponse> history = new ArrayList<>();
        ClinicalEntry current = entryRepository.findById(entryId).orElse(null);
        if (current == null) return history;

        // Traverse down (corrections of this entry)
        List<ClinicalEntry> corrections = entryRepository.findByOriginalEntryId(entryId);
        history.add(mapToResponse(current));
        for (ClinicalEntry c : corrections) {
            history.add(mapToResponse(c));
        }

        return history;
    }

    private void publishSignedEvent(ClinicalEntry entry) {
        try {
            JsonNode payload = objectMapper.readTree(entry.getContentJson());
            ClinicalEventDto event = ClinicalEventDto.builder()
                    .eventType("ENTRY_SIGNED")
                    .encounterId(entry.getEncounter().getId())
                    .patientId(entry.getPatientId())
                    .entryId(entry.getId())
                    .entryType(entry.getEntryType())
                    .authorId(entry.getAuthorId())
                    .authorName(entry.getAuthorName())
                    .authorRole(entry.getAuthorRole())
                    .payload(payload)
                    .timestamp(entry.getSignedAt() != null ? entry.getSignedAt() : Instant.now())
                    .build();
            eventPublisher.publishClinicalEvent(event);
        } catch (Exception e) {
            log.error("Failed to publish entry signed event for entry {}: {}", entry.getId(), e.getMessage());
        }
    }

    public ClinicalEntryResponse mapToResponse(ClinicalEntry entry) {
        JsonNode contentNode;
        try {
            contentNode = objectMapper.readTree(entry.getContentJson());
        } catch (Exception e) {
            contentNode = objectMapper.createObjectNode();
        }

        return ClinicalEntryResponse.builder()
                .id(entry.getId())
                .encounterId(entry.getEncounter() != null ? entry.getEncounter().getId() : null)
                .patientId(entry.getPatientId())
                .authorId(entry.getAuthorId())
                .authorName(entry.getAuthorName())
                .authorRole(entry.getAuthorRole())
                .entryType(entry.getEntryType())
                .contentJson(contentNode)
                .status(entry.getStatus())
                .isCorrection(entry.isCorrection())
                .originalEntryId(entry.getOriginalEntryId())
                .correctionReason(entry.getCorrectionReason())
                .signedAt(entry.getSignedAt())
                .signedById(entry.getSignedById())
                .signedByName(entry.getSignedByName())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
