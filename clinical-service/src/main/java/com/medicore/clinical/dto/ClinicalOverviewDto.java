package com.medicore.clinical.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.medicore.clinical.domain.enums.EncounterStatus;
import com.medicore.clinical.domain.enums.EncounterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalOverviewDto {
    private UUID patientId;
    private UUID activeEncounterId;
    private EncounterType encounterType;
    private EncounterStatus encounterStatus;
    
    // Safety & Precautions
    private List<String> precautions; // e.g. Fall Risk, Contact Isolation, NPO
    private List<PatientAllergyDto> allergies;
    
    // Clinical Summaries
    private JsonNode latestVitals;
    private Instant vitalsRecordedAt;
    private List<ClinicalEntryDtos.ClinicalEntryResponse> activeDiagnoses;
    private List<ClinicalEntryDtos.ClinicalEntryResponse> activeMedications;
    private List<NurseFlagDtos.NurseFlagResponse> openFlags;
    private List<ClinicalEntryDtos.ClinicalEntryResponse> recentNotes;
}
