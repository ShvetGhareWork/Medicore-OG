package com.medicore.clinical.repository;

import com.medicore.clinical.domain.entity.AuditLog;
import com.medicore.clinical.domain.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<AuditLog> findByActionOrderByCreatedAtDesc(AuditAction action);

    Page<AuditLog> findByPatientId(UUID patientId, Pageable pageable);
}
