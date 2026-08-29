package com.example.appointment.client;

import com.example.appointment.dto.PatientResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PatientServiceClientFallback implements PatientServiceClient {

    private static final Logger log = LoggerFactory.getLogger(PatientServiceClientFallback.class);

    @Override
    public PatientResponseDto getPatientById(Long id) {
        log.warn("Fallback triggered: Patient service is unavailable for patientId: {}", id);
        return new PatientResponseDto(id, "Unknown Patient (Service Degraded)", "unknown@hospital.local", "UNKNOWN");
    }
}
