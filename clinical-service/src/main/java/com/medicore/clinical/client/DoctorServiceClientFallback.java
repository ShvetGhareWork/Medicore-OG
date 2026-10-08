package com.medicore.clinical.client;

import com.medicore.clinical.dto.DoctorDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class DoctorServiceClientFallback implements DoctorServiceClient {

    @Override
    public DoctorDto getDoctorById(UUID id) {
        log.warn("Fallback triggered: doctor-service unavailable for doctor ID: {}", id);
        return DoctorDto.builder()
                .id(id)
                .firstName("Attending")
                .lastName("Physician")
                .specialization("General")
                .build();
    }
}
