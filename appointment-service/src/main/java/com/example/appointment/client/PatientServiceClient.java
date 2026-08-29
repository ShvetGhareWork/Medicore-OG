package com.example.appointment.client;

import com.example.appointment.dto.PatientResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-service", url = "${PATIENT_SERVICE_URL:http://localhost:8082}", fallback = PatientServiceClientFallback.class)
public interface PatientServiceClient {

    @GetMapping("/patients/{id}")
    PatientResponseDto getPatientById(@PathVariable("id") Long id);
}
