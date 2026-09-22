package com.example.identity.dto;

import com.example.identity.entity.type.AdmissionStatusType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CreatePatientRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private String contactNumber;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String emergencyContactName;

    private String emergencyContactPhone;

    @NotBlank(message = "Admitting diagnosis is required")
    private String admittingDiagnosis;

    private String triageLevel;

    private Long attendingDoctorId;

    private Long departmentId;

    private String departmentName;

    private String wardNumber;

    private String bedNumber;

    private AdmissionStatusType admissionStatus = AdmissionStatusType.PENDING;

    private LocalDateTime admissionDate;

    private LocalDate expectedDischargeDate;

    public CreatePatientRequest() {
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
}
