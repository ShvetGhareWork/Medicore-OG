package com.medicore.clinical.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String licenseNumber;
}
