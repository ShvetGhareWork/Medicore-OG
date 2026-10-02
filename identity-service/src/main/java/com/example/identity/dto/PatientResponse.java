package com.example.identity.dto;

import com.example.identity.entity.type.AdmissionStatusType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientResponse {
    private Long id;
    private String patientId;
    private String fullName;
    private String email;
    private String contactNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String admittingDiagnosis;
    private String triageLevel;
    private Long attendingDoctorId;
    private String attendingDoctorName;
    private Long departmentId;
    private String departmentName;
    private String wardNumber;
    private String bedNumber;
    private AdmissionStatusType admissionStatus;
    private LocalDateTime admissionDate;
    private LocalDate expectedDischargeDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PatientResponse() {
    }

    public PatientResponse(Long id, String patientId, String fullName, String email, String contactNumber, LocalDate dateOfBirth, String gender, String address, String emergencyContactName, String emergencyContactPhone, String admittingDiagnosis, String triageLevel, Long attendingDoctorId, String attendingDoctorName, Long departmentId, String departmentName, String wardNumber, String bedNumber, AdmissionStatusType admissionStatus, LocalDateTime admissionDate, LocalDate expectedDischargeDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactPhone = emergencyContactPhone;
        this.admittingDiagnosis = admittingDiagnosis;
        this.triageLevel = triageLevel;
        this.attendingDoctorId = attendingDoctorId;
        this.attendingDoctorName = attendingDoctorName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.wardNumber = wardNumber;
        this.bedNumber = bedNumber;
        this.admissionStatus = admissionStatus;
        this.admissionDate = admissionDate;
        this.expectedDischargeDate = expectedDischargeDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }

    public String getAdmittingDiagnosis() {
        return admittingDiagnosis;
    }

    public void setAdmittingDiagnosis(String admittingDiagnosis) {
        this.admittingDiagnosis = admittingDiagnosis;
    }

    public String getTriageLevel() {
        return triageLevel;
    }

    public void setTriageLevel(String triageLevel) {
        this.triageLevel = triageLevel;
    }

    public Long getAttendingDoctorId() {
        return attendingDoctorId;
    }

    public void setAttendingDoctorId(Long attendingDoctorId) {
        this.attendingDoctorId = attendingDoctorId;
    }

    public String getAttendingDoctorName() {
        return attendingDoctorName;
    }

    public void setAttendingDoctorName(String attendingDoctorName) {
        this.attendingDoctorName = attendingDoctorName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getWardNumber() {
        return wardNumber;
    }

    public void setWardNumber(String wardNumber) {
        this.wardNumber = wardNumber;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    public AdmissionStatusType getAdmissionStatus() {
        return admissionStatus;
    }

    public void setAdmissionStatus(AdmissionStatusType admissionStatus) {
        this.admissionStatus = admissionStatus;
    }

    public LocalDateTime getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDateTime admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDate getExpectedDischargeDate() {
        return expectedDischargeDate;
    }

    public void setExpectedDischargeDate(LocalDate expectedDischargeDate) {
        this.expectedDischargeDate = expectedDischargeDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
