package com.example.heal.service;

import com.example.heal.entity.Insurance;
import com.example.heal.entity.Patient;
import com.example.heal.repository.InsuranceRepository;
import com.example.heal.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Patient assignInsuranceToPatient(Insurance insurance, Long patientid){
        Patient patient = patientRepository.findById(patientid)
        .orElseThrow(() -> new EntityNotFoundException("Patient not found with id: " + patientid));

        patient.setInsurance(insurance);
        insurance.setPatient(patient);

        return patient;
    }

    @Transactional
    public Patient dissolveInsuranceFromPatient(Long patientid){
        Patient patient = patientRepository.findById(patientid)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with id: " + patientid));

        patient.setInsurance(null);
        return patient;
    }
}
