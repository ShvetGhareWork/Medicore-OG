package com.example.heal.service;

import com.example.heal.dto.AppointmentResponseDto;
import com.example.heal.dto.CreateAppointmentRequestDto;
import com.example.heal.entity.Appointment;
import com.example.heal.entity.Doctor;
import com.example.heal.entity.Patient;
import com.example.heal.repository.AppointmentRepository;
import com.example.heal.repository.DoctorRepository;
import com.example.heal.repository.PatientRepository;
import com.example.heal.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

    @Transactional
    @Secured("ROLE_PATIENT")
    public AppointmentResponseDto createNewAppointment(CreateAppointmentRequestDto createAppointmentRequestDto){
        Long doctorId = createAppointmentRequestDto.getDoctorId();
        Long patientId = createAppointmentRequestDto.getPatientId();

        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new EntityNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        Appointment appointment = Appointment.builder()
                .reason(createAppointmentRequestDto.getReason())
                .appointmentTime((createAppointmentRequestDto.getAppointmentTime()))
                .build();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        return modelMapper.map(appointmentRepository.save(appointment), AppointmentResponseDto.class);
    }

    @Transactional
    @PreAuthorize("hasAuthority('appointment:write') or #doctorId == authentication.principal.id")
    public Appointment reAssignAppointmentToAnotherDoctor(Long doctorId, Long appointmentId){
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new EntityNotFoundException("Appointments not found"));

        appointment.setDoctor(doctor);
        doctor.getAppointments().add(appointment);

        return appointmentRepository.save(appointment);
    }

    @PreAuthorize("hasRole('ADMIN') OR (hasRole('DOCTOR') AND #doctorId == authentication.principal.id)")
    public List<AppointmentResponseDto> getAllAppointmentsOfDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();

        return doctor.getAppointments()
                .stream()
                .map(appointment -> modelMapper.map(appointment, AppointmentResponseDto.class))
                .collect(Collectors.toList());
    }
}
