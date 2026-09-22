package com.example.identity.service;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffResponse;
import com.example.identity.entity.Department;
import com.example.identity.entity.Staff;
import com.example.identity.entity.User;
import com.example.identity.entity.type.*;
import com.example.identity.repository.DepartmentRepository;
import com.example.identity.repository.StaffRepository;
import com.example.identity.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StaffServiceTest {

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private StaffService staffService;

    @BeforeEach
    void setUp() {
        staffService = new StaffService(staffRepository, departmentRepository, userRepository, passwordEncoder);
    }

    @Test
    void testGetRolePrefix() {
        assertEquals("DOC", staffService.getRolePrefix(RoleType.DOCTOR));
        assertEquals("NRS", staffService.getRolePrefix(RoleType.NURSE));
        assertEquals("LAB", staffService.getRolePrefix(RoleType.PATHOLOGIST));
        assertEquals("INS", staffService.getRolePrefix(RoleType.INSURANCE_COORDINATOR));
        assertEquals("ADM", staffService.getRolePrefix(RoleType.ADMINISTRATIVE));
        assertEquals("LTC", staffService.getRolePrefix(RoleType.LAB_TECHNICIAN));
        assertEquals("STF", staffService.getRolePrefix(RoleType.PATIENT));
    }

    @Test
    void testGenerateStaffIdWhenNoExisting() {
        int year = Year.now().getValue();
        String pattern = "DOC-" + year + "-%";
        when(staffRepository.findStaffIdsForPrefixWithLock(pattern)).thenReturn(List.of());

        String generatedId = staffService.generateStaffId(RoleType.DOCTOR);
        assertEquals("DOC-" + year + "-0001", generatedId);
        verify(staffRepository).findStaffIdsForPrefixWithLock(pattern);
    }

    @Test
    void testGenerateStaffIdIncrementsMaxExistingSequence() {
        int year = Year.now().getValue();
        String pattern = "NRS-" + year + "-%";
        when(staffRepository.findStaffIdsForPrefixWithLock(pattern))
                .thenReturn(List.of("NRS-" + year + "-0001", "NRS-" + year + "-0042", "NRS-" + year + "-0010"));

        String generatedId = staffService.generateStaffId(RoleType.NURSE);
        assertEquals("NRS-" + year + "-0043", generatedId);
    }

    @Test
    void testCreateStaffSuccess() {
        CreateStaffRequest request = new CreateStaffRequest(
                "Dr. John Doe",
                "john.doe@medicore.org",
                "+1234567890",
                LocalDate.of(1985, 5, 20),
                RoleType.DOCTOR,
                "Cardiology",
                "Senior Consultant",
                null,
                AccessLevelType.ELEVATED,
                LoginMethodType.PASSWORD,
                "tempPass123",
                "http://example.com/photo.jpg"
        );

        when(staffRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("tempPass123")).thenReturn("hashedPassword123");
        when(departmentRepository.findByNameIgnoreCase("Cardiology")).thenReturn(Optional.of(new Department(1L, "Cardiology", "CARD")));

        Staff savedStaff = new Staff();
        savedStaff.setId(100L);
        savedStaff.setStaffId("DOC-2026-0001");
        savedStaff.setFullName(request.getFullName());
        savedStaff.setEmail(request.getEmail());
        savedStaff.setRole(RoleType.DOCTOR);
        savedStaff.setStatus(StaffStatusType.ACTIVE);

        when(staffRepository.save(any(Staff.class))).thenReturn(savedStaff);

        StaffResponse response = staffService.createStaff(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("DOC-2026-0001", response.getStaffId());

        verify(staffRepository).save(any(Staff.class));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateStaffDuplicateEmailThrowsException() {
        CreateStaffRequest request = new CreateStaffRequest();
        request.setEmail("john.doe@medicore.org");

        when(staffRepository.existsByEmail(request.getEmail())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> staffService.createStaff(request));

        assertTrue(ex.getMessage().contains("already exists"));
        verify(staffRepository, never()).save(any());
    }

    @Test
    void testDeactivateStaff() {
        Staff staff = new Staff();
        staff.setId(50L);
        staff.setStaffId("DOC-2026-0010");
        staff.setEmail("john.doe@medicore.org");
        staff.setStatus(StaffStatusType.ACTIVE);

        when(staffRepository.findById(50L)).thenReturn(Optional.of(staff));
        when(staffRepository.save(any(Staff.class))).thenAnswer(i -> i.getArgument(0));

        StaffResponse response = staffService.deactivateStaff(50L);

        assertEquals(StaffStatusType.INACTIVE, staff.getStatus());
        assertEquals(StaffStatusType.INACTIVE, response.getStatus());
    }
}
