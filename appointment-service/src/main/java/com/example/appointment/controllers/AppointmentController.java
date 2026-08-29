package com.example.appointment.controllers;

import com.example.appointment.dto.AppointmentResponseDto;
import com.example.appointment.dto.CreateAppointmentRequestDto;
import com.example.appointment.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDto> createNewAppointment(@RequestBody CreateAppointmentRequestDto createAppointmentRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDto));
    }

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponseDto> bookAppointment(@RequestBody CreateAppointmentRequestDto createAppointmentRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsOfDoctor(@PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsOfDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsOfPatient(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsOfPatient(patientId));
    }

    @PutMapping("/{appointmentId}/reassign/{doctorId}")
    public ResponseEntity<AppointmentResponseDto> reassignAppointment(
            @PathVariable("appointmentId") Long appointmentId,
            @PathVariable("doctorId") Long doctorId
    ) {
        return ResponseEntity.ok(appointmentService.reAssignAppointmentToAnotherDoctor(doctorId, appointmentId));
    }
}
