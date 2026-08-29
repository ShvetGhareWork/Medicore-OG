package com.example.patient.service;

import com.example.patient.dto.BloodGroupCountResponseEntity;
import com.example.patient.dto.CreatePatientRequestDto;
import com.example.patient.dto.PatientCreatedEvent;
import com.example.patient.dto.PatientResponseDto;
import com.example.patient.entity.Patient;
import com.example.patient.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;
    private final PatientKafkaProducer patientKafkaProducer;

    public PatientService(PatientRepository patientRepository, ModelMapper modelMapper, PatientKafkaProducer patientKafkaProducer) {
        this.patientRepository = patientRepository;
        this.modelMapper = modelMapper;
        this.patientKafkaProducer = patientKafkaProducer;
    }

    @Transactional(readOnly = true)
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient with id: " + patientId + " not found"));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    public List<PatientResponseDto> getAllPatients(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        return patientRepository.findAllPatients(pageable)
                .stream()
                .map(patient -> modelMapper.map(patient, PatientResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientResponseDto createPatient(CreatePatientRequestDto requestDto) {
        Patient patient = Patient.builder()
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .email(requestDto.getEmail())
                .gender(requestDto.getGender())
                .birthDate(requestDto.getBirthDate())
                .bloodGroupType(requestDto.getBloodGroupType())
                .userId(requestDto.getUserId())
                .build();

        Patient saved = patientRepository.save(patient);

        // Publish event to Kafka
        PatientCreatedEvent event = new PatientCreatedEvent(saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail());
        patientKafkaProducer.sendPatientCreatedEvent(event);

        return modelMapper.map(saved, PatientResponseDto.class);
    }

    public List<BloodGroupCountResponseEntity> getBloodGroupCounts() {
        return patientRepository.countEachBloodGroupType();
    }
}
