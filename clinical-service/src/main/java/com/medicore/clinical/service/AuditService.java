package com.medicore.clinical.service;

import com.medicore.clinical.domain.entity.AuditLog;
import com.medicore.clinical.domain.enums.AuditAction;
import com.medicore.clinical.repository.AuditLogRepository;
import com.medicore.clinical.security.SecurityUtils;
import io.micrometer.tracing.Tracer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final Tracer tracer;

    public void logAction(AuditAction action, String resourceType, String resourceId, UUID patientId, String detailsJson) {
        try {
            String traceId = tracer != null && tracer.currentSpan() != null ? tracer.currentSpan().context().traceId() : null;
            UUID userId = SecurityUtils.getCurrentUserId();
            String username = SecurityUtils.getCurrentUsername();
            String userRole = SecurityUtils.getCurrentUser().map(u -> String.join(",", u.getRoles())).orElse("UNKNOWN");

            AuditLog logEntry = AuditLog.builder()
                    .traceId(traceId)
                    .userId(userId)
                    .username(username)
                    .userRole(userRole)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .patientId(patientId)
                    .details(detailsJson)
                    .build();

            auditLogRepository.save(logEntry);
            log.info("Audit log recorded: action={}, user={}, patient={}, resource={}", action, username, patientId, resourceId);
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage(), e);
        }
    }
}
