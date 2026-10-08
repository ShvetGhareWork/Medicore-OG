package com.medicore.clinical.repository;

import com.medicore.clinical.domain.entity.Encounter;
import com.medicore.clinical.domain.enums.EncounterStatus;
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
public interface EncounterRepository extends JpaRepository<Encounter, UUID> {

    List<Encounter> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    List<Encounter> findByDoctorIdOrderByCreatedAtDesc(UUID doctorId);

    List<Encounter> findByStatus(EncounterStatus status);

    @Query("SELECT e FROM Encounter e WHERE e.patientId = :patientId AND e.status = :status")
    List<Encounter> findByPatientIdAndStatus(@Param("patientId") UUID patientId, @Param("status") EncounterStatus status);

    @Query("SELECT e FROM Encounter e WHERE e.patientId = :patientId AND e.status IN ('IN_PROGRESS', 'PLANNED') ORDER BY e.createdAt DESC")
    List<Encounter> findActiveEncountersByPatientId(@Param("patientId") UUID patientId);

    Page<Encounter> findAll(Pageable pageable);
}
