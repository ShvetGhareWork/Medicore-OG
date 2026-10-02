package com.example.appointment.client;

import com.example.appointment.dto.DoctorResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "doctor-service", fallback = DoctorServiceClientFallback.class)
public interface DoctorServiceClient {

    @GetMapping("/doctors/{id}")
    DoctorResponseDto getDoctorById(@PathVariable("id") Long id);
}
