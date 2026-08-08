package com.example.heal.controllers;

import com.example.heal.dto.DoctorResponseDto;
import com.example.heal.dto.OnBoardNewDoctorDto;
import com.example.heal.dto.PatientResponseDto;
import com.example.heal.entity.Patient;
import com.example.heal.service.DoctorService;
import com.example.heal.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    @PostMapping("/patients")
    public ResponseEntity<List<PatientResponseDto>> getAllPatients(
            @RequestParam(value = "page", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "size", defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok(patientService.getAllPatients(pageNumber, pageSize));
    }

    @PostMapping("/onBoardNewDoctor")
    public ResponseEntity<DoctorResponseDto> onBoardNewDoctor(@RequestBody OnBoardNewDoctorDto onboardNewDoctorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.onBoardNewDoctor(onboardNewDoctorDto));
    }
}
