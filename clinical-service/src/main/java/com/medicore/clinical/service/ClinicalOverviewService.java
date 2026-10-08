package com.medicore.clinical.service;

import com.medicore.clinical.client.PatientServiceClient;
import com.medicore.clinical.domain.entity.ClinicalEntry;
import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.enums.AuditAction;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import com.medicore.clinical.domain.enums.FlagStatus;
import com.medicore.clinical.dto.ClinicalEntryDtos;
import com.medicore.clinical.dto.ClinicalOverviewDto;
import com.medicore.clinical.dto.NurseFlagDtos;
import com.medicore.clinical.dto.PatientSummaryDto;
import com.medicore.clinical.repository.ClinicalEntryRepository;
import com.medicore.clinical.repository.EncounterRepository;
import com.medicore.clinical.repository.NurseFlagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicalOverviewService {

    private final EncounterRepository encounterRepository;
    private final ClinicalEntryRepository entryRepository;
    private final NurseFlagRepository flagRepository;
    private final ClinicalEntryService entryService;
    private final NurseFlagService flagService;
    private final PatientServiceClient patientClient;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public ClinicalOverviewDto getPatientOverview(UUID patientId) {
        // 1. Audit patient chart view
        auditService.logAction(AuditAction.VIEW_PATIENT_CHART, "PATIENT_CHART", patientId.toString(), patientId, null);

        // 2. Resolve Active Encounter
        List<Encounter> activeEncounters = encounterRepository.findActiveEncountersByPatientId(patientId);
        Encounter activeEncounter = activeEncounters.isEmpty() ? null : activeEncounters.get(0);

        // 3. Fetch Patient Demographics & Allergies (via Feign)
        PatientSummaryDto patientSummary = null;
        try {
            patientSummary = patientClient.getPatientById(patientId);
        } catch (Exception e) {
            log.warn("Failed to retrieve patient from patient-service: {}", e.getMessage());
        }

        // 4. Latest Vitals
        List<ClinicalEntry> vitalsEntries = entryRepository.findByPatientIdAndEntryTypeOrderByCreatedAtDesc(patientId, EntryType.VITALS_SIGN);
        ClinicalEntryDtos.ClinicalEntryResponse latestVitalsEntry = vitalsEntries.isEmpty() ? null : entryService.mapToResponse(vitalsEntries.get(0));

        // 5. Active Diagnoses
        List<ClinicalEntry> diagnoses = entryRepository.findByPatientIdAndEntryTypeOrderByCreatedAtDesc(patientId, EntryType.DIAGNOSIS);
        List<ClinicalEntryDtos.ClinicalEntryResponse> activeDiagnoses = diagnoses.stream()
                .filter(d -> d.getStatus() != EntryStatus.CANCELLED)
                .map(entryService::mapToResponse)
                .collect(Collectors.toList());

        // 6. Active Medications
        List<ClinicalEntry> prescriptions = entryRepository.findByPatientIdAndEntryTypeOrderByCreatedAtDesc(patientId, EntryType.PRESCRIPTION);
        List<ClinicalEntryDtos.ClinicalEntryResponse> activeMedications = prescriptions.stream()
                .filter(p -> p.getStatus() != EntryStatus.CANCELLED)
                .map(entryService::mapToResponse)
                .collect(Collectors.toList());

        // 7. Open Nurse Flags
        List<NurseFlagDtos.NurseFlagResponse> openFlags = flagRepository.findOpenFlagsByPatientId(patientId)
                .stream()
                .map(flagService::mapToResponse)
                .collect(Collectors.toList());

        // 8. Recent Notes (SOAP, Nurse notes, etc.)
        List<ClinicalEntry> allEntries = entryRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        List<ClinicalEntryDtos.ClinicalEntryResponse> recentNotes = allEntries.stream()
                .limit(10)
                .map(entryService::mapToResponse)
                .collect(Collectors.toList());

        // 9. Infer Precautions
        List<String> precautions = new ArrayList<>();
        if (openFlags.stream().anyMatch(f -> f.getFlagType().name().contains("FALL"))) {
            precautions.add("Fall Risk");
        }
        if (openFlags.stream().anyMatch(f -> f.getSeverity().name().equals("CRITICAL"))) {
            precautions.add("Strict Observation");
        }
        if (patientSummary != null && patientSummary.getAllergies() != null && !patientSummary.getAllergies().isEmpty()) {
            precautions.add("Known Allergies Alert");
        }
        if (precautions.isEmpty()) {
            precautions.add("Standard Precautions");
        }

        return ClinicalOverviewDto.builder()
                .patientId(patientId)
                .activeEncounterId(activeEncounter != null ? activeEncounter.getId() : null)
                .encounterType(activeEncounter != null ? activeEncounter.getType() : null)
                .encounterStatus(activeEncounter != null ? activeEncounter.getStatus() : null)
                .precautions(precautions)
                .allergies(patientSummary != null ? patientSummary.getAllergies() : Collections.emptyList())
                .latestVitals(latestVitalsEntry != null ? latestVitalsEntry.getContentJson() : null)
                .vitalsRecordedAt(latestVitalsEntry != null ? latestVitalsEntry.getCreatedAt() : null)
                .activeDiagnoses(activeDiagnoses)
                .activeMedications(activeMedications)
                .openFlags(openFlags)
                .recentNotes(recentNotes)
                .build();
    }
}
