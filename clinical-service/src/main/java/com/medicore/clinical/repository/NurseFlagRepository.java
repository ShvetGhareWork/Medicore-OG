package com.medicore.clinical.repository;

import com.medicore.clinical.domain.entity.NurseFlag;
import com.medicore.clinical.domain.enums.FlagSeverity;
import com.medicore.clinical.domain.enums.FlagStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NurseFlagRepository extends JpaRepository<NurseFlag, UUID> {

    List<NurseFlag> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    List<NurseFlag> findByEncounterIdOrderByCreatedAtDesc(UUID encounterId);

    List<NurseFlag> findByStatusOrderByCreatedAtDesc(FlagStatus status);

    @Query("SELECT f FROM NurseFlag f WHERE f.patientId = :patientId AND f.status = 'OPEN' ORDER BY f.createdAt DESC")
    List<NurseFlag> findOpenFlagsByPatientId(@Param("patientId") UUID patientId);

    @Query("SELECT f FROM NurseFlag f WHERE f.encounter.id = :encounterId AND f.status = 'OPEN' ORDER BY f.createdAt DESC")
    List<NurseFlag> findOpenFlagsByEncounterId(@Param("encounterId") UUID encounterId);

    long countByPatientIdAndStatus(UUID patientId, FlagStatus status);

    long countByPatientIdAndStatusAndSeverity(UUID patientId, FlagStatus status, FlagSeverity severity);

    Page<NurseFlag> findAll(Pageable pageable);
}
