package com.medicore.clinical.repository;

import com.medicore.clinical.domain.entity.ClinicalEntry;
import com.medicore.clinical.domain.enums.EntryStatus;
import com.medicore.clinical.domain.enums.EntryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicalEntryRepository extends JpaRepository<ClinicalEntry, UUID> {

    List<ClinicalEntry> findByEncounterIdOrderByCreatedAtDesc(UUID encounterId);

    List<ClinicalEntry> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    List<ClinicalEntry> findByPatientIdAndEntryTypeOrderByCreatedAtDesc(UUID patientId, EntryType entryType);

    List<ClinicalEntry> findByEncounterIdAndEntryTypeOrderByCreatedAtDesc(UUID encounterId, EntryType entryType);

    List<ClinicalEntry> findByOriginalEntryId(UUID originalEntryId);

    @Query("SELECT e FROM ClinicalEntry e WHERE e.patientId = :patientId AND e.entryType = :entryType AND e.status = :status ORDER BY e.createdAt DESC")
    List<ClinicalEntry> findByPatientIdAndEntryTypeAndStatus(
            @Param("patientId") UUID patientId,
            @Param("entryType") EntryType entryType,
            @Param("status") EntryStatus status
    );

    @Query("SELECT e FROM ClinicalEntry e WHERE e.encounter.id = :encounterId AND e.entryType IN :entryTypes ORDER BY e.createdAt DESC")
    List<ClinicalEntry> findByEncounterIdAndEntryTypes(
            @Param("encounterId") UUID encounterId,
            @Param("entryTypes") List<EntryType> entryTypes
    );

    Page<ClinicalEntry> findByPatientId(UUID patientId, Pageable pageable);
}
