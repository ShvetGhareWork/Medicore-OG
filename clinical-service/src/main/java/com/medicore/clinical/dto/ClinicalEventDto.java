package com.medicore.clinical.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.EntryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalEventDto {
    private String eventId;
    private String eventType; // ENTRY_SIGNED, NURSE_FLAG_RAISED, NURSE_FLAG_RESOLVED, ENCOUNTER_COMPLETED
    private UUID encounterId;
    private UUID patientId;
    private UUID entryId;
    private EntryType entryType;
    private UUID authorId;
    private String authorName;
    private AuthorRole authorRole;
    private JsonNode payload;
    private Instant timestamp;
}
