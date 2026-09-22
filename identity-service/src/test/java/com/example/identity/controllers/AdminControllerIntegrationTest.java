package com.example.identity.controllers;

import com.example.identity.dto.CreatePatientRequest;
import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.PatientResponse;
import com.example.identity.dto.StaffResponse;
import com.example.identity.entity.type.AccessLevelType;
import com.example.identity.entity.type.LoginMethodType;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;
import com.example.identity.security.CustomUserDetailsService;
import com.example.identity.security.JwtAuthFilter;
import com.example.identity.security.Oauth2SuccessHandler;
import com.example.identity.service.PatientService;
import com.example.identity.service.StaffService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AdminController.class, PatientAdminController.class})
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StaffService staffService;

    @MockBean
    private PatientService patientService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private Oauth2SuccessHandler oauth2SuccessHandler;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateStaffHappyPath() throws Exception {
        CreateStaffRequest request = new CreateStaffRequest(
                "Dr. Sarah Connor",
                "sarah.connor@hospital.org",
                "+1555999888",
                LocalDate.of(1980, 1, 1),
                RoleType.DOCTOR,
                "Emergency care",
                "Chief Officer",
                null,
                AccessLevelType.ELEVATED,
                LoginMethodType.BADGE_QR,
                "pass123",
                "http://example.com/photo.png"
        );

        StaffResponse mockResponse = new StaffResponse(
                1L, "DOC-2026-0001", "Dr. Sarah Connor", "sarah.connor@hospital.org",
                "+1555999888", LocalDate.of(1980, 1, 1), RoleType.DOCTOR, "Emergency care",
                "Chief Officer", null, null, AccessLevelType.ELEVATED, LoginMethodType.BADGE_QR,
                "badgeToken", 1, StaffStatusType.ACTIVE, null, "http://example.com/photo.png"
        );

        when(staffService.createStaff(any(CreateStaffRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/admin/staff")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.staffId").value("DOC-2026-0001"))
                .andExpect(jsonPath("$.fullName").value("Dr. Sarah Connor"))
                .andExpect(jsonPath("$.email").value("sarah.connor@hospital.org"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateStaffValidationFailureCase() throws Exception {
        CreateStaffRequest invalidRequest = new CreateStaffRequest();
        invalidRequest.setFullName(""); // Blank fullName
        invalidRequest.setEmail("invalid-email-format"); // Invalid email
        invalidRequest.setRole(null); // Missing role

        mockMvc.perform(post("/admin/staff")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.fullName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.role").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreatePatientHappyPath() throws Exception {
        CreatePatientRequest request = new CreatePatientRequest();
        request.setFullName("John Smith");
        request.setEmail("john.smith@example.com");
        request.setContactNumber("+1555000111");
        request.setAdmittingDiagnosis("Acute Pneumonia");
        request.setWardNumber("General");
        request.setBedNumber("Bed #10");

        PatientResponse mockResponse = new PatientResponse();
        mockResponse.setId(20L);
        mockResponse.setPatientId("PT-2026-0010");
        mockResponse.setFullName("John Smith");
        mockResponse.setEmail("john.smith@example.com");
        mockResponse.setAdmittingDiagnosis("Acute Pneumonia");

        when(patientService.createPatient(any(CreatePatientRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/admin/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(20))
                .andExpect(jsonPath("$.patientId").value("PT-2026-0010"))
                .andExpect(jsonPath("$.fullName").value("John Smith"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreatePatientValidationFailureCase() throws Exception {
        CreatePatientRequest invalidRequest = new CreatePatientRequest();
        invalidRequest.setFullName(""); // Blank fullName
        invalidRequest.setAdmittingDiagnosis(""); // Blank admittingDiagnosis

        mockMvc.perform(post("/admin/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.fullName").exists())
                .andExpect(jsonPath("$.fieldErrors.admittingDiagnosis").exists());
    }
}
