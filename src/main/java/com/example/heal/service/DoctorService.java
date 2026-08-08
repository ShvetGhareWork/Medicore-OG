package com.example.heal.service;

import com.example.heal.dto.DoctorResponseDto;
import com.example.heal.dto.OnBoardNewDoctorDto;
import com.example.heal.entity.Doctor;
import com.example.heal.entity.User; // 1. Fixed entity import
import com.example.heal.entity.type.RoleType;
import com.example.heal.repository.DoctorRepository;
import com.example.heal.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public List<DoctorResponseDto> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doctor -> modelMapper.map(doctor, DoctorResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponseDto onBoardNewDoctor(OnBoardNewDoctorDto onBoardNewDoctorDto) {
        // Extract raw ID to prevent redundant orElseThrow() calls
        Long userId = onBoardNewDoctorDto.getUserId();
//                .orElseThrow(() -> new IllegalArgumentException("User ID must not be null"));

        // 2. Fixed existsById parameter type passing
        if (doctorRepository.existsById(userId)) {
            throw new IllegalStateException("Doctor already exists");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 3. Fixed static reference calls to instance method calls
        Doctor doctor = Doctor.builder()
                .name(onBoardNewDoctorDto.getName())
                .specialization(onBoardNewDoctorDto.getSpecialization())
                .user(user)
                .build();

        user.getRoles().add(RoleType.DOCTOR);
        userRepository.save(user); // Persist updated user roles

        return modelMapper.map(doctorRepository.save(doctor), DoctorResponseDto.class);
    }
}
