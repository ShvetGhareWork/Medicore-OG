package com.medicore.clinical.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

public class ClinicalEntryDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateClinicalEntryRequest {
        @NotNull(message = "Encounter ID is required")
        private UUID encounterId;

        @NotNull(message = "Patient ID is required")
        private UUID patientId;

        @NotNull(message = "Entry type is required")
        private EntryType entryType;

        @NotNull(message = "Content JSON is required")
        private JsonNode contentJson;

        @Builder.Default
        private boolean autoSign = false;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AmendClinicalEntryRequest {
        @NotNull(message = "Content JSON is required")
        private JsonNode contentJson;

        @NotNull(message = "Correction reason is required")
        private String correctionReason;

        @Builder.Default
        private boolean autoSign = false;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ClinicalEntryResponse {
        private UUID id;
        private UUID encounterId;
        private UUID patientId;
        private UUID authorId;
        private String authorName;
        private AuthorRole authorRole;
        private EntryType entryType;
        private JsonNode contentJson;
        private EntryStatus status;
        private boolean isCorrection;
        private UUID originalEntryId;
        private String correctionReason;
        private Instant signedAt;
        private UUID signedById;
        private String signedByName;
        private Instant createdAt;
    }
}
