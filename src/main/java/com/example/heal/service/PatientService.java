package com.example.heal.service;

import com.example.heal.dto.PatientResponseDto;
import com.example.heal.entity.Patient;
import com.example.heal.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // Fixed import
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient with id: " + patientId + " not found"));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    public List<PatientResponseDto> getAllPatients(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize); // Fixed layout instantiation

        return patientRepository.findAllPatients(pageable)
                .stream()
                .map(patient -> modelMapper.map(patient, PatientResponseDto.class))
                .collect(Collectors.toList());
    }
}
