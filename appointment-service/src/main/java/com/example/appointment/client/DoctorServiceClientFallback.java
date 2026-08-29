package com.example.appointment.client;

import com.example.appointment.dto.DoctorResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DoctorServiceClientFallback implements DoctorServiceClient {

    private static final Logger log = LoggerFactory.getLogger(DoctorServiceClientFallback.class);

    @Override
    public DoctorResponseDto getDoctorById(Long id) {
        log.warn("Fallback triggered: Doctor service is unavailable for doctorId: {}", id);
        return new DoctorResponseDto(id, id, "Unknown Doctor (Service Degraded)", "General", "unknown-doctor@hospital.local");
    }
}
