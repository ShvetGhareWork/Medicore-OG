package com.medicore.clinical.client;

import com.medicore.clinical.dto.PatientSummaryDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.UUID;

@Component
@Slf4j
public class PatientServiceClientFallback implements PatientServiceClient {

    @Override
    public PatientSummaryDto getPatientById(UUID id) {
        log.warn("Fallback triggered: patient-service unavailable for patient ID: {}", id);
        return PatientSummaryDto.builder()
                .id(id)
                .firstName("Unknown")
                .lastName("Patient")
                .allergies(Collections.emptyList())
                .build();
    }
}
