package com.example.identity.service;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffResponse;
import com.example.identity.entity.User;
import com.example.identity.entity.type.*;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StaffServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private StaffService staffService;

    @BeforeEach
    void setUp() {
        staffService = new StaffService(userRepository, passwordEncoder);
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
        when(userRepository.findStaffIdsForPrefixWithLock(pattern)).thenReturn(List.of());

        String generatedId = staffService.generateStaffId(RoleType.DOCTOR);
        assertEquals("DOC-" + year + "-0001", generatedId);
        verify(userRepository).findStaffIdsForPrefixWithLock(pattern);
    }

    @Test
    void testGenerateStaffIdIncrementsMaxExistingSequence() {
        int year = Year.now().getValue();
        String pattern = "NRS-" + year + "-%";
        when(userRepository.findStaffIdsForPrefixWithLock(pattern))
                .thenReturn(List.of("NRS-" + year + "-0001", "NRS-" + year + "-0042", "NRS-" + year + "-0010"));

        String generatedId = staffService.generateStaffId(RoleType.NURSE);
        assertEquals("NRS-" + year + "-0043", generatedId);
    }

    @Test
    void testGenerateBadgeTokenUniqueness() {
        when(userRepository.existsByBadgeToken(anyString()))
                .thenReturn(true) // First attempt collision
                .thenReturn(false); // Second attempt unique

        String token = staffService.generateBadgeToken();
        assertNotNull(token);
        assertFalse(token.isBlank());
        verify(userRepository, times(2)).existsByBadgeToken(anyString());
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

        when(userRepository.findByUsername(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("tempPass123")).thenReturn("hashedPassword123");

        User savedUser = User.builder()
                .id(100L)
                .username(request.getEmail())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .staffId("DOC-2026-0001")
                .badgeToken("badgeToken123")
                .status(StaffStatusType.ACTIVE)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        StaffResponse response = staffService.createStaff(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("DOC-2026-0001", response.getStaffId());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();
        assertEquals("john.doe@medicore.org", capturedUser.getUsername());
        assertEquals("john.doe@medicore.org", capturedUser.getEmail());
        assertEquals("hashedPassword123", capturedUser.getPassword());
        assertEquals(StaffStatusType.ACTIVE, capturedUser.getStatus());
        assertEquals(1, capturedUser.getBadgeVersion());
    }

    @Test
    void testCreateStaffDuplicateEmailThrowsException() {
        CreateStaffRequest request = new CreateStaffRequest();
        request.setEmail("john.doe@medicore.org");

        when(userRepository.findByUsername(request.getEmail())).thenReturn(Optional.of(new User()));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> staffService.createStaff(request));

        assertTrue(ex.getMessage().contains("already exists"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void testDeactivateStaffIncrementsBadgeVersion() {
        User user = User.builder()
                .id(50L)
                .staffId("DOC-2026-0010")
                .status(StaffStatusType.ACTIVE)
                .badgeVersion(1)
                .build();

        when(userRepository.findById(50L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        StaffResponse response = staffService.deactivateStaff(50L);

        assertEquals(StaffStatusType.INACTIVE, user.getStatus());
        assertEquals(2, user.getBadgeVersion());
        assertEquals(StaffStatusType.INACTIVE, response.getStatus());
        assertEquals(2, response.getBadgeVersion());
    }
}
