package com.example.appointment.dto;

import java.time.LocalDateTime;

public class AppointmentResponseDto {
    private Long id;
    private LocalDateTime appointmentTime;
    private String reason;
    private Long patientId;
    private Long doctorId;
    private PatientResponseDto patient;
    private DoctorResponseDto doctor;

    public AppointmentResponseDto() {
    }

    public AppointmentResponseDto(Long id, LocalDateTime appointmentTime, String reason, Long patientId, Long doctorId, PatientResponseDto patient, DoctorResponseDto doctor) {
        this.id = id;
        this.appointmentTime = appointmentTime;
        this.reason = reason;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.patient = patient;
        this.doctor = doctor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public PatientResponseDto getPatient() {
        return patient;
    }

    public void setPatient(PatientResponseDto patient) {
        this.patient = patient;
    }

    public DoctorResponseDto getDoctor() {
        return doctor;
    }

    public void setDoctor(DoctorResponseDto doctor) {
        this.doctor = doctor;
    }
}
