package com.example.identity.repository;

import com.example.identity.entity.Patient;
import com.example.identity.entity.type.AdmissionStatusType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
    Optional<Patient> findByPatientId(String patientId);
    boolean existsByPatientId(String patientId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p.patientId FROM Patient p WHERE p.patientId LIKE :pattern")
    List<String> findPatientIdsForPrefixWithLock(@Param("pattern") String pattern);

    boolean existsByWardNumberAndBedNumberAndAdmissionStatus(String wardNumber, String bedNumber, AdmissionStatusType admissionStatus);
}
