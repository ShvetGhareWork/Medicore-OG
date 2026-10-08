package com.medicore.clinical.dto;

import com.medicore.clinical.domain.enums.EncounterStatus;
import com.medicore.clinical.domain.enums.EncounterType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

public class EncounterDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateEncounterRequest {
        @NotNull(message = "Patient ID is required")
        private UUID patientId;

        @NotNull(message = "Doctor ID is required")
        private UUID doctorId;

        private UUID nurseId;
        private UUID departmentId;

        @NotNull(message = "Encounter type is required")
        private EncounterType type;

        private String chiefComplaint;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateEncounterStatusRequest {
        @NotNull(message = "Status is required")
        private EncounterStatus status;
        private Instant endTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EncounterResponse {
        private UUID id;
        private UUID patientId;
        private UUID doctorId;
        private UUID nurseId;
        private UUID departmentId;
        private EncounterType type;
        private EncounterStatus status;
        private Instant startTime;
        private Instant endTime;
        private String chiefComplaint;
        private Instant createdAt;
        private Instant updatedAt;
    }
}
