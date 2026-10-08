package com.medicore.clinical.dto;

import com.medicore.clinical.domain.enums.FlagSeverity;
import com.medicore.clinical.domain.enums.FlagStatus;
import com.medicore.clinical.domain.enums.FlagType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

public class NurseFlagDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateNurseFlagRequest {
        @NotNull(message = "Encounter ID is required")
        private UUID encounterId;

        @NotNull(message = "Patient ID is required")
        private UUID patientId;

        @NotNull(message = "Flag type is required")
        private FlagType flagType;

        @NotNull(message = "Severity is required")
        private FlagSeverity severity;

        @NotBlank(message = "Message is required")
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResolveNurseFlagRequest {
        private UUID responseEntryId;
        private String resolutionNotes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NurseFlagResponse {
        private UUID id;
        private UUID encounterId;
        private UUID patientId;
        private UUID nurseId;
        private String nurseName;
        private FlagType flagType;
        private FlagSeverity severity;
        private String message;
        private FlagStatus status;
        private UUID responseEntryId;
        private UUID acknowledgedBy;
        private Instant acknowledgedAt;
        private UUID resolvedBy;
        private Instant resolvedAt;
        private Instant createdAt;
        private Instant updatedAt;
    }
}
