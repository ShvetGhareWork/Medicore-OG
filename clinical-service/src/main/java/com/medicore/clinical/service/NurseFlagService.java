package com.medicore.clinical.service;

import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.entity.NurseFlag;
import com.medicore.clinical.domain.enums.AuditAction;
import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.FlagStatus;
import com.medicore.clinical.dto.ClinicalEventDto;
import com.medicore.clinical.dto.NurseFlagDtos.*;
import com.medicore.clinical.repository.EncounterRepository;
import com.medicore.clinical.repository.NurseFlagRepository;
import com.medicore.clinical.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NurseFlagService {

    private final NurseFlagRepository flagRepository;
    private final EncounterRepository encounterRepository;
    private final AuditService auditService;
    private final ClinicalEventPublisher eventPublisher;

    @Transactional
    public NurseFlagResponse createFlag(CreateNurseFlagRequest request) {
        Encounter encounter = encounterRepository.findById(request.getEncounterId())
                .orElseThrow(() -> new NoSuchElementException("Encounter not found with ID: " + request.getEncounterId()));

        UUID nurseId = SecurityUtils.getCurrentUserId();
        String nurseName = SecurityUtils.getCurrentFullName();

        NurseFlag flag = NurseFlag.builder()
                .encounter(encounter)
                .patientId(request.getPatientId())
                .nurseId(nurseId != null ? nurseId : UUID.randomUUID())
                .nurseName(nurseName)
                .flagType(request.getFlagType())
                .severity(request.getSeverity())
                .message(request.getMessage())
                .status(FlagStatus.OPEN)
                .build();

        NurseFlag saved = flagRepository.save(flag);
        auditService.logAction(AuditAction.CREATE_FLAG, "NURSE_FLAG", saved.getId().toString(), saved.getPatientId(), "severity=" + saved.getSeverity());

        eventPublisher.publishNurseFlagEvent(ClinicalEventDto.builder()
                .eventType("NURSE_FLAG_RAISED")
                .encounterId(saved.getEncounter().getId())
                .patientId(saved.getPatientId())
                .authorId(saved.getNurseId())
                .authorName(saved.getNurseName())
                .authorRole(AuthorRole.NURSE)
                .timestamp(Instant.now())
                .build());

        log.info("Nurse flag {} created for patient {}", saved.getId(), saved.getPatientId());
        return mapToResponse(saved);
    }

    @Transactional
    public NurseFlagResponse acknowledgeFlag(UUID flagId) {
        NurseFlag flag = flagRepository.findById(flagId)
                .orElseThrow(() -> new NoSuchElementException("Nurse flag not found with ID: " + flagId));

        UUID userId = SecurityUtils.getCurrentUserId();
        flag.setStatus(FlagStatus.ACKNOWLEDGED);
        flag.setAcknowledgedBy(userId);
        flag.setAcknowledgedAt(Instant.now());

        NurseFlag saved = flagRepository.save(flag);
        auditService.logAction(AuditAction.ACKNOWLEDGE_FLAG, "NURSE_FLAG", saved.getId().toString(), saved.getPatientId(), null);

        return mapToResponse(saved);
    }

    @Transactional
    public NurseFlagResponse resolveFlag(UUID flagId, ResolveNurseFlagRequest request) {
        NurseFlag flag = flagRepository.findById(flagId)
                .orElseThrow(() -> new NoSuchElementException("Nurse flag not found with ID: " + flagId));

        UUID userId = SecurityUtils.getCurrentUserId();
        flag.setStatus(FlagStatus.RESOLVED);
        flag.setResolvedBy(userId);
        flag.setResolvedAt(Instant.now());
        if (request != null && request.getResponseEntryId() != null) {
            flag.setResponseEntryId(request.getResponseEntryId());
        }

        NurseFlag saved = flagRepository.save(flag);
        auditService.logAction(AuditAction.RESOLVE_FLAG, "NURSE_FLAG", saved.getId().toString(), saved.getPatientId(), "responseEntryId=" + flag.getResponseEntryId());

        eventPublisher.publishNurseFlagEvent(ClinicalEventDto.builder()
                .eventType("NURSE_FLAG_RESOLVED")
                .encounterId(saved.getEncounter().getId())
                .patientId(saved.getPatientId())
                .authorId(userId)
                .authorName(SecurityUtils.getCurrentFullName())
                .authorRole(SecurityUtils.hasRole("DOCTOR") ? AuthorRole.DOCTOR : AuthorRole.NURSE)
                .timestamp(Instant.now())
                .build());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<NurseFlagResponse> getOpenFlagsByPatientId(UUID patientId) {
        return flagRepository.findOpenFlagsByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NurseFlagResponse> getFlagsByEncounterId(UUID encounterId) {
        return flagRepository.findByEncounterIdOrderByCreatedAtDesc(encounterId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NurseFlagResponse mapToResponse(NurseFlag flag) {
        return NurseFlagResponse.builder()
                .id(flag.getId())
                .encounterId(flag.getEncounter() != null ? flag.getEncounter().getId() : null)
                .patientId(flag.getPatientId())
                .nurseId(flag.getNurseId())
                .nurseName(flag.getNurseName())
                .flagType(flag.getFlagType())
                .severity(flag.getSeverity())
                .message(flag.getMessage())
                .status(flag.getStatus())
                .responseEntryId(flag.getResponseEntryId())
                .acknowledgedBy(flag.getAcknowledgedBy())
                .acknowledgedAt(flag.getAcknowledgedAt())
                .resolvedBy(flag.getResolvedBy())
                .resolvedAt(flag.getResolvedAt())
                .createdAt(flag.getCreatedAt())
                .updatedAt(flag.getUpdatedAt())
                .build();
    }
}
