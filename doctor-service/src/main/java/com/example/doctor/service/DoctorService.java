package com.example.doctor.service;

import com.example.doctor.dto.DoctorResponseDto;
import com.example.doctor.dto.OnBoardNewDoctorDto;
import com.example.doctor.entity.Doctor;
import com.example.doctor.repository.DoctorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    public DoctorService(DoctorRepository doctorRepository, ModelMapper modelMapper) {
        this.doctorRepository = doctorRepository;
        this.modelMapper = modelMapper;
    }

    public List<DoctorResponseDto> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doctor -> modelMapper.map(doctor, DoctorResponseDto.class))
                .collect(Collectors.toList());
    }

    public DoctorResponseDto getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with id: " + doctorId));
        return modelMapper.map(doctor, DoctorResponseDto.class);
    }

    @Transactional
    public DoctorResponseDto onBoardNewDoctor(OnBoardNewDoctorDto onBoardNewDoctorDto) {
        Long userId = onBoardNewDoctorDto.getUserId();

        if (userId != null && doctorRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Doctor with userId " + userId + " already exists");
        }

        Doctor doctor = Doctor.builder()
                .userId(userId)
                .name(onBoardNewDoctorDto.getName())
                .specialization(onBoardNewDoctorDto.getSpecialization())
                .email(onBoardNewDoctorDto.getEmail())
                .build();

        Doctor saved = doctorRepository.save(doctor);
        return modelMapper.map(saved, DoctorResponseDto.class);
    }
}
