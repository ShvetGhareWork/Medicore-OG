package com.example.heal.repository;

import com.example.heal.dto.BloodGroupCountResponseEntity;
import com.example.heal.entity.Patient;
import com.example.heal.entity.type.BloodGroupType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // ✅ Fix: Changed from findByName to findByFirstName
    Patient findByFirstName(String firstName);

    List<Patient> findByBirthDateOrEmail(LocalDate birthDate, String email);

    List<Patient> findByBirthDateBetween(LocalDate startDate, LocalDate endDate);

    // ✅ Fix: Changed to search inside firstName instead of name
    List<Patient> findByFirstNameContainingOrderByIdDesc(String query);

    // ✅ Fix: Updated property name to bloodGroupType
    @Query("SELECT p FROM Patient p where p.bloodGroupType = ?1")
    List<Patient> findByBloodGroupType(BloodGroupType bloodGroupType);

    @Query("select p from Patient p where p.birthDate > :birthDate")
    List<Patient> findByBornAfterDate(@Param("birthDate") LocalDate birthDate);

    // ✅ Fix: Updated path mapping to match bloodGroupType
    @Query("select new com.example.heal.dto.BloodGroupCountResponseEntity(p.bloodGroupType, Count(p)) " +
            "from Patient p group by p.bloodGroupType")
    List<BloodGroupCountResponseEntity> countEachBloodGroupType();

    @Query(value = "select * from patient", nativeQuery = true)
    Page<Patient> findAllPatients(Pageable pageable);

    // ✅ Fix: Updated to set firstName instead of name
    @Transactional
    @Modifying
    @Query("UPDATE Patient p SET p.firstName = :firstName where p.id = :id")
    int updateFirstNameWithId(@Param("firstName") String firstName, @Param("id") Long id);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.appointments")
    List<Patient> findAllPatientWithAppointment();
}
