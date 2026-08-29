package com.example.patient.repository;

import com.example.patient.dto.BloodGroupCountResponseEntity;
import com.example.patient.entity.Patient;
import com.example.patient.entity.type.BloodGroupType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findByFirstName(String firstName);

    List<Patient> findByBirthDateOrEmail(LocalDate birthDate, String email);

    List<Patient> findByBirthDateBetween(LocalDate startDate, LocalDate endDate);

    List<Patient> findByFirstNameContainingOrderByIdDesc(String query);

    @Query("SELECT p FROM Patient p WHERE p.bloodGroupType = ?1")
    List<Patient> findByBloodGroupType(BloodGroupType bloodGroupType);

    @Query("SELECT p FROM Patient p WHERE p.birthDate > :birthDate")
    List<Patient> findByBornAfterDate(@Param("birthDate") LocalDate birthDate);

    @Query("SELECT new com.example.patient.dto.BloodGroupCountResponseEntity(p.bloodGroupType, COUNT(p)) " +
            "FROM Patient p GROUP BY p.bloodGroupType")
    List<BloodGroupCountResponseEntity> countEachBloodGroupType();

    @Query(value = "SELECT * FROM patient", nativeQuery = true)
    Page<Patient> findAllPatients(Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Patient p SET p.firstName = :firstName WHERE p.id = :id")
    int updateFirstNameWithId(@Param("firstName") String firstName, @Param("id") Long id);
}
