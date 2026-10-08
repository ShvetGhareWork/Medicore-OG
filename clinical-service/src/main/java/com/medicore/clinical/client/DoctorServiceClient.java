package com.medicore.clinical.client;

import com.medicore.clinical.dto.DoctorDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "DOCTOR-SERVICE", fallback = DoctorServiceClientFallback.class)
public interface DoctorServiceClient {

    @GetMapping("/doctors/{id}")
    DoctorDto getDoctorById(@PathVariable("id") UUID id);
}
