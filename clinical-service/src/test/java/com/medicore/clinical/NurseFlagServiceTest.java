package com.medicore.clinical;

import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.entity.NurseFlag;
import com.medicore.clinical.domain.enums.FlagSeverity;
import com.medicore.clinical.domain.enums.FlagStatus;
import com.medicore.clinical.domain.enums.FlagType;
import com.medicore.clinical.dto.NurseFlagDtos.*;
import com.medicore.clinical.repository.EncounterRepository;
import com.medicore.clinical.repository.NurseFlagRepository;
import com.medicore.clinical.service.AuditService;
import com.medicore.clinical.service.ClinicalEventPublisher;
import com.medicore.clinical.service.NurseFlagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NurseFlagServiceTest {

    @Mock
    private NurseFlagRepository flagRepository;

    @Mock
    private EncounterRepository encounterRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private ClinicalEventPublisher eventPublisher;

    @InjectMocks
    private NurseFlagService flagService;

    private UUID encounterId;
    private UUID patientId;
    private Encounter encounter;

    @BeforeEach
    void setUp() {
        encounterId = UUID.randomUUID();
        patientId = UUID.randomUUID();
        encounter = Encounter.builder()
                .id(encounterId)
                .patientId(patientId)
                .build();
    }

    @Test
    @DisplayName("Should create nurse flag and publish alert event")
    void shouldCreateNurseFlag() {
        CreateNurseFlagRequest request = CreateNurseFlagRequest.builder()
                .encounterId(encounterId)
                .patientId(patientId)
                .flagType(FlagType.ABNORMAL_VITALS)
                .severity(FlagSeverity.HIGH)
                .message("Systolic BP > 180 mmHg")
                .build();

        when(encounterRepository.findById(encounterId)).thenReturn(Optional.of(encounter));
        when(flagRepository.save(any(NurseFlag.class))).thenAnswer(inv -> {
            NurseFlag f = inv.getArgument(0);
            f.setId(UUID.randomUUID());
            f.setCreatedAt(Instant.now());
            f.setUpdatedAt(Instant.now());
            return f;
        });

        NurseFlagResponse response = flagService.createFlag(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(FlagStatus.OPEN);
        assertThat(response.getSeverity()).isEqualTo(FlagSeverity.HIGH);
        verify(eventPublisher, times(1)).publishNurseFlagEvent(any());
        verify(auditService, times(1)).logAction(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should resolve nurse flag and record response entry ID")
    void shouldResolveNurseFlag() {
        UUID flagId = UUID.randomUUID();
        UUID responseEntryId = UUID.randomUUID();
        NurseFlag flag = NurseFlag.builder()
                .id(flagId)
                .encounter(encounter)
                .patientId(patientId)
                .nurseId(UUID.randomUUID())
                .nurseName("Nurse Joy")
                .flagType(FlagType.MEDICATION_CONCERN)
                .severity(FlagSeverity.MEDIUM)
                .message("Patient experiencing nausea post-antibiotic")
                .status(FlagStatus.OPEN)
                .build();

        ResolveNurseFlagRequest request = ResolveNurseFlagRequest.builder()
                .responseEntryId(responseEntryId)
                .resolutionNotes("Prescribed antiemetic")
                .build();

        when(flagRepository.findById(flagId)).thenReturn(Optional.of(flag));
        when(flagRepository.save(any(NurseFlag.class))).thenAnswer(inv -> inv.getArgument(0));

        NurseFlagResponse response = flagService.resolveFlag(flagId, request);

        assertThat(response.getStatus()).isEqualTo(FlagStatus.RESOLVED);
        assertThat(response.getResponseEntryId()).isEqualTo(responseEntryId);
        assertThat(response.getResolvedAt()).isNotNull();
        verify(eventPublisher, times(1)).publishNurseFlagEvent(any());
    }
}
