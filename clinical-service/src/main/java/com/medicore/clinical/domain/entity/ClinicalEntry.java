package com.medicore.clinical.domain.entity;

import com.medicore.clinical.domain.enums.AuthorRole;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "clinical_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    @Column(name = "author_name", nullable = false, length = 128)
    private String authorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "author_role", nullable = false, length = 32)
    private AuthorRole authorRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 64)
    private EntryType entryType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_json", nullable = false, columnDefinition = "jsonb")
    private String contentJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private EntryStatus status = EntryStatus.DRAFT;

    @Column(name = "is_correction", nullable = false)
    @Builder.Default
    private boolean isCorrection = false;

    @Column(name = "original_entry_id")
    private UUID originalEntryId;

    @Column(name = "correction_reason", columnDefinition = "TEXT")
    private String correctionReason;

    @Column(name = "signed_at")
    private Instant signedAt;

    @Column(name = "signed_by_id")
    private UUID signedById;

    @Column(name = "signed_by_name", length = 128)
    private String signedByName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
