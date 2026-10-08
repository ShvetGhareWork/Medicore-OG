package com.medicore.clinical.client;

import com.medicore.clinical.dto.PatientSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "PATIENT-SERVICE", fallback = PatientServiceClientFallback.class)
public interface PatientServiceClient {

    @GetMapping("/patients/{id}")
    PatientSummaryDto getPatientById(@PathVariable("id") UUID id);
}
