package com.example.identity.repository;

import com.example.identity.entity.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {

    Page<AdminAuditLog> findAllByOrderByTimestampDesc(Pageable pageable);

    List<AdminAuditLog> findTop20ByIdentifierOrderByTimestampDesc(String identifier);
}
