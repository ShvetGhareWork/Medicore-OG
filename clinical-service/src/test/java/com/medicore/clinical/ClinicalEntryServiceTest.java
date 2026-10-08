package com.medicore.clinical;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.medicore.clinical.domain.entity.ClinicalEntry;
import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import com.medicore.clinical.dto.ClinicalEntryDtos.*;
import com.medicore.clinical.repository.ClinicalEntryRepository;
import com.medicore.clinical.repository.EncounterRepository;
import com.medicore.clinical.service.AuditService;
import com.medicore.clinical.service.ClinicalEntryService;
import com.medicore.clinical.service.ClinicalEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClinicalEntryServiceTest {

    @Mock
    private ClinicalEntryRepository entryRepository;

    @Mock
    private EncounterRepository encounterRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private ClinicalEventPublisher eventPublisher;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ClinicalEntryService entryService;

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
                .doctorId(UUID.randomUUID())
                .build();
    }

    @Test
    @DisplayName("Should create draft clinical entry successfully")
    void shouldCreateDraftEntry() {
        ObjectNode content = objectMapper.createObjectNode();
        content.put("subjective", "Patient reports mild chest pain");

        CreateClinicalEntryRequest request = CreateClinicalEntryRequest.builder()
                .encounterId(encounterId)
                .patientId(patientId)
                .entryType(EntryType.SOAP_NOTE)
                .contentJson(content)
                .autoSign(false)
                .build();

        when(encounterRepository.findById(encounterId)).thenReturn(Optional.of(encounter));
        when(entryRepository.save(any(ClinicalEntry.class))).thenAnswer(invocation -> {
            ClinicalEntry e = invocation.getArgument(0);
            e.setId(UUID.randomUUID());
            e.setCreatedAt(Instant.now());
            return e;
        });

        ClinicalEntryResponse response = entryService.createEntry(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(EntryStatus.DRAFT);
        assertThat(response.isCorrection()).isFalse();
        assertThat(response.getEntryType()).isEqualTo(EntryType.SOAP_NOTE);
        verify(entryRepository, times(1)).save(any(ClinicalEntry.class));
        verify(auditService, times(1)).logAction(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should sign clinical entry and emit Kafka event")
    void shouldSignEntry() {
        UUID entryId = UUID.randomUUID();
        ClinicalEntry draft = ClinicalEntry.builder()
                .id(entryId)
                .encounter(encounter)
                .patientId(patientId)
                .authorId(UUID.randomUUID())
                .authorName("Dr. Jane Smith")
                .authorRole(AuthorRole.DOCTOR)
                .entryType(EntryType.DIAGNOSIS)
                .contentJson("{\"icd10\":\"I10\",\"description\":\"Essential hypertension\"}")
                .status(EntryStatus.DRAFT)
                .build();

        when(entryRepository.findById(entryId)).thenReturn(Optional.of(draft));
        when(entryRepository.save(any(ClinicalEntry.class))).thenAnswer(inv -> inv.getArgument(0));

        ClinicalEntryResponse response = entryService.signEntry(entryId);

        assertThat(response.getStatus()).isEqualTo(EntryStatus.SIGNED);
        assertThat(response.getSignedAt()).isNotNull();
        verify(eventPublisher, times(1)).publishClinicalEvent(any());
        verify(auditService, times(1)).logAction(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should amend clinical entry by creating new linked correction entry and marking original as AMENDED")
    void shouldAmendEntryWithoutDeletingOriginal() {
        UUID originalEntryId = UUID.randomUUID();
        ClinicalEntry original = ClinicalEntry.builder()
                .id(originalEntryId)
                .encounter(encounter)
                .patientId(patientId)
                .authorId(UUID.randomUUID())
                .authorName("Dr. Jane Smith")
                .authorRole(AuthorRole.DOCTOR)
                .entryType(EntryType.PRESCRIPTION)
                .contentJson("{\"medication\":\"Amoxicillin\",\"dosage\":\"250mg\"}")
                .status(EntryStatus.SIGNED)
                .build();

        ObjectNode correctedContent = objectMapper.createObjectNode();
        correctedContent.put("medication", "Amoxicillin");
        correctedContent.put("dosage", "500mg");

        AmendClinicalEntryRequest request = AmendClinicalEntryRequest.builder()
                .contentJson(correctedContent)
                .correctionReason("Dosage adjustment based on kidney function")
                .autoSign(true)
                .build();

        when(entryRepository.findById(originalEntryId)).thenReturn(Optional.of(original));
        when(entryRepository.save(any(ClinicalEntry.class))).thenAnswer(inv -> {
            ClinicalEntry e = inv.getArgument(0);
            if (e.getId() == null) e.setId(UUID.randomUUID());
            return e;
        });

        ClinicalEntryResponse response = entryService.amendEntry(originalEntryId, request);

        assertThat(original.getStatus()).isEqualTo(EntryStatus.AMENDED);
        assertThat(response.isCorrection()).isTrue();
        assertThat(response.getOriginalEntryId()).isEqualTo(originalEntryId);
        assertThat(response.getCorrectionReason()).isEqualTo("Dosage adjustment based on kidney function");
        assertThat(response.getStatus()).isEqualTo(EntryStatus.SIGNED);
        verify(entryRepository, times(2)).save(any(ClinicalEntry.class)); // 1 for marking original, 1 for new correction
    }
}
