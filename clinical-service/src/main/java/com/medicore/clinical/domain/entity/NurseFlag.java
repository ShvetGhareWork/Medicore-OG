package com.medicore.clinical.domain.entity;

import com.medicore.clinical.domain.enums.FlagSeverity;
import com.medicore.clinical.domain.enums.FlagStatus;
import com.medicore.clinical.domain.enums.FlagType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "nurse_flags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NurseFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "nurse_id", nullable = false)
    private UUID nurseId;

    @Column(name = "nurse_name", nullable = false, length = 128)
    private String nurseName;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag_type", nullable = false, length = 64)
    private FlagType flagType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private FlagSeverity severity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private FlagStatus status = FlagStatus.OPEN;

    @Column(name = "response_entry_id")
    private UUID responseEntryId;

    @Column(name = "acknowledged_by")
    private UUID acknowledgedBy;

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "resolved_by")
    private UUID resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
