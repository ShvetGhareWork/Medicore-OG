package com.example.appointment.service;

import com.example.appointment.client.DoctorServiceClient;
import com.example.appointment.client.PatientServiceClient;
import com.example.appointment.dto.AppointmentResponseDto;
import com.example.appointment.dto.CreateAppointmentRequestDto;
import com.example.appointment.dto.DoctorResponseDto;
import com.example.appointment.dto.PatientResponseDto;
import com.example.appointment.entity.Appointment;
import com.example.appointment.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    private final ModelMapper modelMapper;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientServiceClient patientServiceClient,
                              DoctorServiceClient doctorServiceClient,
                              ModelMapper modelMapper) {
        this.appointmentRepository = appointmentRepository;
        this.patientServiceClient = patientServiceClient;
        this.doctorServiceClient = doctorServiceClient;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public AppointmentResponseDto createNewAppointment(CreateAppointmentRequestDto createAppointmentRequestDto) {
        Long doctorId = createAppointmentRequestDto.getDoctorId();
        Long patientId = createAppointmentRequestDto.getPatientId();

        // Validate existence via Feign clients (with resilience fallbacks)
        PatientResponseDto patient = patientServiceClient.getPatientById(patientId);
        DoctorResponseDto doctor = doctorServiceClient.getDoctorById(doctorId);

        Appointment appointment = Appointment.builder()
                .reason(createAppointmentRequestDto.getReason())
                .appointmentTime(createAppointmentRequestDto.getAppointmentTime())
                .patientId(patientId)
                .doctorId(doctorId)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        AppointmentResponseDto response = modelMapper.map(saved, AppointmentResponseDto.class);
        response.setPatient(patient);
        response.setDoctor(doctor);
        return response;
    }

    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

        AppointmentResponseDto response = modelMapper.map(appointment, AppointmentResponseDto.class);
        try {
            response.setPatient(patientServiceClient.getPatientById(appointment.getPatientId()));
        } catch (Exception ignored) {}
        try {
            response.setDoctor(doctorServiceClient.getDoctorById(appointment.getDoctorId()));
        } catch (Exception ignored) {}

        return response;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(appointment -> {
                    AppointmentResponseDto dto = modelMapper.map(appointment, AppointmentResponseDto.class);
                    try {
                        dto.setPatient(patientServiceClient.getPatientById(appointment.getPatientId()));
                    } catch (Exception ignored) {}
                    try {
                        dto.setDoctor(doctorServiceClient.getDoctorById(appointment.getDoctorId()));
                    } catch (Exception ignored) {}
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAllAppointmentsOfDoctor(Long doctorId) {
        DoctorResponseDto doctor = null;
        try {
            doctor = doctorServiceClient.getDoctorById(doctorId);
        } catch (Exception ignored) {}

        final DoctorResponseDto finalDoctor = doctor;
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(appointment -> {
                    AppointmentResponseDto dto = modelMapper.map(appointment, AppointmentResponseDto.class);
                    dto.setDoctor(finalDoctor);
                    try {
                        dto.setPatient(patientServiceClient.getPatientById(appointment.getPatientId()));
                    } catch (Exception ignored) {}
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAllAppointmentsOfPatient(Long patientId) {
        PatientResponseDto patient = null;
        try {
            patient = patientServiceClient.getPatientById(patientId);
        } catch (Exception ignored) {}

        final PatientResponseDto finalPatient = patient;
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(appointment -> {
                    AppointmentResponseDto dto = modelMapper.map(appointment, AppointmentResponseDto.class);
                    dto.setPatient(finalPatient);
                    try {
                        dto.setDoctor(doctorServiceClient.getDoctorById(appointment.getDoctorId()));
                    } catch (Exception ignored) {}
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponseDto reAssignAppointmentToAnotherDoctor(Long doctorId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

        DoctorResponseDto doctor = doctorServiceClient.getDoctorById(doctorId);
        appointment.setDoctorId(doctorId);
        Appointment saved = appointmentRepository.save(appointment);

        AppointmentResponseDto response = modelMapper.map(saved, AppointmentResponseDto.class);
        response.setDoctor(doctor);
        try {
            response.setPatient(patientServiceClient.getPatientById(appointment.getPatientId()));
        } catch (Exception ignored) {}
        return response;
    }
}
