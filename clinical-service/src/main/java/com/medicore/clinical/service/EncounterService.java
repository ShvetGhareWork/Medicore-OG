package com.medicore.clinical.service;

import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.enums.AuditAction;
import com.medicore.clinical.domain.enums.EncounterStatus;
import com.medicore.clinical.dto.ClinicalEventDto;
import com.medicore.clinical.dto.EncounterDtos.*;
import com.medicore.clinical.repository.EncounterRepository;
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
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final AuditService auditService;
    private final ClinicalEventPublisher eventPublisher;

    @Transactional
    public EncounterResponse createEncounter(CreateEncounterRequest request) {
        Encounter encounter = Encounter.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .nurseId(request.getNurseId())
                .departmentId(request.getDepartmentId())
                .type(request.getType())
                .status(EncounterStatus.IN_PROGRESS)
                .startTime(Instant.now())
                .chiefComplaint(request.getChiefComplaint())
                .build();

        Encounter saved = encounterRepository.save(encounter);
        auditService.logAction(AuditAction.CREATE_ENCOUNTER, "ENCOUNTER", saved.getId().toString(), saved.getPatientId(), null);

        log.info("Created encounter {} for patient {}", saved.getId(), saved.getPatientId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public EncounterResponse getEncounterById(UUID id) {
        Encounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found with ID: " + id));
        return mapToResponse(encounter);
    }

    @Transactional(readOnly = true)
    public List<EncounterResponse> getEncountersByPatientId(UUID patientId) {
        return encounterRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EncounterResponse> getEncountersByDoctorId(UUID doctorId) {
        return encounterRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EncounterResponse updateEncounterStatus(UUID id, UpdateEncounterStatusRequest request) {
        Encounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found with ID: " + id));

        encounter.setStatus(request.getStatus());
        if (request.getStatus() == EncounterStatus.COMPLETED || request.getStatus() == EncounterStatus.DISCHARGED) {
            encounter.setEndTime(request.getEndTime() != null ? request.getEndTime() : Instant.now());
        }

        Encounter updated = encounterRepository.save(encounter);
        auditService.logAction(AuditAction.UPDATE_ENCOUNTER, "ENCOUNTER", updated.getId().toString(), updated.getPatientId(), "status=" + request.getStatus());

        if (request.getStatus() == EncounterStatus.COMPLETED || request.getStatus() == EncounterStatus.DISCHARGED) {
            eventPublisher.publishClinicalEvent(ClinicalEventDto.builder()
                    .eventType("ENCOUNTER_COMPLETED")
                    .encounterId(updated.getId())
                    .patientId(updated.getPatientId())
                    .timestamp(Instant.now())
                    .build());
        }

        return mapToResponse(updated);
    }

    public EncounterResponse mapToResponse(Encounter encounter) {
        return EncounterResponse.builder()
                .id(encounter.getId())
                .patientId(encounter.getPatientId())
                .doctorId(encounter.getDoctorId())
                .nurseId(encounter.getNurseId())
                .departmentId(encounter.getDepartmentId())
                .type(encounter.getType())
                .status(encounter.getStatus())
                .startTime(encounter.getStartTime())
                .endTime(encounter.getEndTime())
                .chiefComplaint(encounter.getChiefComplaint())
                .createdAt(encounter.getCreatedAt())
                .updatedAt(encounter.getUpdatedAt())
                .build();
    }
}
