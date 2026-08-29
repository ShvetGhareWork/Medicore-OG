package com.example.insurance.service;

import com.example.insurance.dto.InsuranceRequestDto;
import com.example.insurance.dto.InsuranceResponseDto;
import com.example.insurance.entity.Insurance;
import com.example.insurance.repository.InsuranceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;
    private final ModelMapper modelMapper;

    public InsuranceService(InsuranceRepository insuranceRepository, ModelMapper modelMapper) {
        this.insuranceRepository = insuranceRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<InsuranceResponseDto> getAllInsurances() {
        return insuranceRepository.findAll().stream()
                .map(ins -> modelMapper.map(ins, InsuranceResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InsuranceResponseDto getInsuranceById(Long id) {
        Insurance insurance = insuranceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Insurance not found with id: " + id));
        return modelMapper.map(insurance, InsuranceResponseDto.class);
    }

    @Transactional(readOnly = true)
    public InsuranceResponseDto getInsuranceByPatientId(Long patientId) {
        Insurance insurance = insuranceRepository.findByPatientId(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Insurance not found for patientId: " + patientId));
        return modelMapper.map(insurance, InsuranceResponseDto.class);
    }

    @Transactional
    public InsuranceResponseDto createInsurance(InsuranceRequestDto requestDto) {
        if (insuranceRepository.findByPolicyNumber(requestDto.getPolicyNumber()).isPresent()) {
            throw new IllegalStateException("Insurance policy number already exists: " + requestDto.getPolicyNumber());
        }

        Insurance insurance = Insurance.builder()
                .policyNumber(requestDto.getPolicyNumber())
                .provider(requestDto.getProvider())
                .validUntil(requestDto.getValidUntil())
                .patientId(requestDto.getPatientId())
                .build();

        Insurance saved = insuranceRepository.save(insurance);
        return modelMapper.map(saved, InsuranceResponseDto.class);
    }

    @Transactional
    public InsuranceResponseDto assignInsuranceToPatient(Long insuranceId, Long patientId) {
        Insurance insurance = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> new EntityNotFoundException("Insurance not found with id: " + insuranceId));

        insurance.setPatientId(patientId);
        Insurance saved = insuranceRepository.save(insurance);
        return modelMapper.map(saved, InsuranceResponseDto.class);
    }

    @Transactional
    public InsuranceResponseDto dissolveInsuranceFromPatient(Long patientId) {
        Insurance insurance = insuranceRepository.findByPatientId(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Insurance not found for patientId: " + patientId));

        insurance.setPatientId(null);
        Insurance saved = insuranceRepository.save(insurance);
        return modelMapper.map(saved, InsuranceResponseDto.class);
    }
}
