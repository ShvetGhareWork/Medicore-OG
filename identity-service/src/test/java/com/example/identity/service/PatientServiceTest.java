package com.example.identity.service;

import com.example.identity.dto.CreatePatientRequest;
import com.example.identity.dto.PatientResponse;
import com.example.identity.entity.Department;
import com.example.identity.entity.Patient;
import com.example.identity.entity.type.AdmissionStatusType;
import com.example.identity.repository.DepartmentRepository;
import com.example.identity.repository.PatientRepository;
import com.example.identity.repository.StaffRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    private PatientService patientService;

    @BeforeEach
    void setUp() {
        patientService = new PatientService(patientRepository, staffRepository, departmentRepository);
    }

    @Test
    void testGeneratePatientIdWhenNoExisting() {
        int year = Year.now().getValue();
        String pattern = "PT-" + year + "-%";
        when(patientRepository.findPatientIdsForPrefixWithLock(pattern)).thenReturn(List.of());

        String generatedId = patientService.generatePatientId();
        assertEquals("PT-" + year + "-0001", generatedId);
    }

    @Test
    void testCreatePatientSuccess() {
        CreatePatientRequest request = new CreatePatientRequest();
        request.setFullName("Jane Doe");
        request.setEmail("jane.doe@example.com");
        request.setContactNumber("+1555123456");
        request.setAdmittingDiagnosis("Severe Chest Pain");
        request.setTriageLevel("ESI Level 2");
        request.setDepartmentName("Emergency Care");
        request.setWardNumber("ICU");
        request.setBedNumber("Bed #01");
        request.setAdmissionStatus(AdmissionStatusType.ADMITTED);

        when(patientRepository.existsByWardNumberAndBedNumberAndAdmissionStatus("ICU", "Bed #01", AdmissionStatusType.ADMITTED)).thenReturn(false);
        when(departmentRepository.findByNameIgnoreCase("Emergency Care")).thenReturn(Optional.of(new Department(1L, "Emergency Care", "EMERG")));

        Patient savedPatient = new Patient();
        savedPatient.setId(10L);
        savedPatient.setPatientId("PT-2026-0001");
        savedPatient.setFullName("Jane Doe");

        when(patientRepository.save(any(Patient.class))).thenReturn(savedPatient);

        PatientResponse response = patientService.createPatient(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("PT-2026-0001", response.getPatientId());
        assertEquals("Jane Doe", response.getFullName());
    }

    @Test
    void testCreatePatientOccupyBedThrowsException() {
        CreatePatientRequest request = new CreatePatientRequest();
        request.setFullName("Jane Doe");
        request.setAdmittingDiagnosis("Severe Chest Pain");
        request.setWardNumber("ICU");
        request.setBedNumber("Bed #01");
        request.setAdmissionStatus(AdmissionStatusType.ADMITTED);

        when(patientRepository.existsByWardNumberAndBedNumberAndAdmissionStatus("ICU", "Bed #01", AdmissionStatusType.ADMITTED)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> patientService.createPatient(request));

        assertTrue(ex.getMessage().contains("currently occupied"));
        verify(patientRepository, never()).save(any());
    }
}
