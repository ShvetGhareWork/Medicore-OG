package com.example.identity.service;

import com.example.identity.entity.AdminAuditLog;
import com.example.identity.repository.AdminAuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminAuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuditLogService.class);
    private final AdminAuditLogRepository auditLogRepository;

    public AdminAuditLogService(AdminAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logEvent(String eventType, String identifier, Long userId, String roles, String status, String details) {
        try {
            AdminAuditLog auditLog = new AdminAuditLog(eventType, identifier, userId, roles, status, details);
            auditLogRepository.save(auditLog);
            log.info("[AUDIT] Event: {}, Identifier: {}, Status: {}, Details: {}", eventType, identifier, status, details);
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }

    public Page<AdminAuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable);
    }
}
