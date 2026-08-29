package com.example.appointment.dto;

import java.time.LocalDateTime;

public class CreateAppointmentRequestDto {
    private Long doctorId;
    private Long patientId;
    private LocalDateTime appointmentTime;
    private String reason;

    public CreateAppointmentRequestDto() {
    }

    public CreateAppointmentRequestDto(Long doctorId, Long patientId, LocalDateTime appointmentTime, String reason) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.appointmentTime = appointmentTime;
        this.reason = reason;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
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
}
