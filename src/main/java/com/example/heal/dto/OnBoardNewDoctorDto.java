package com.example.heal.dto;

import lombok.Data;

@Data
public class OnBoardNewDoctorDto {
    private Long userId;
    private String name;
    private String specialization;
}
