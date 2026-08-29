package com.example.insurance.repository;

import com.example.insurance.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    Optional<Insurance> findByPatientId(Long patientId);
    Optional<Insurance> findByPolicyNumber(String policyNumber);
}
