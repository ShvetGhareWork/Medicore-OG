package com.example.doctor.controllers;

import com.example.doctor.dto.DoctorResponseDto;
import com.example.doctor.dto.OnBoardNewDoctorDto;
import com.example.doctor.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDto> getDoctorById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PostMapping("/onboard")
    public ResponseEntity<DoctorResponseDto> onBoardNewDoctor(@RequestBody OnBoardNewDoctorDto onBoardNewDoctorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.onBoardNewDoctor(onBoardNewDoctorDto));
    }
}
