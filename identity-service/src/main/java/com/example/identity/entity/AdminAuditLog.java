package com.example.identity.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_audit_logs")
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType; // e.g. ADMIN_LOGIN_SUCCESS, ADMIN_LOGIN_FAILED, ADMIN_ACCOUNT_LOCKED, BADGE_LOGIN_SUCCESS, BADGE_LOGIN_FAILED

    private String identifier; // staffId or username or email

    private Long userId; // user id if resolved

    private String roles;

    private String status; // SUCCESS, FAILED, BLOCKED

    @Column(length = 1000)
    private String details;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;

    public AdminAuditLog() {
    }

    public AdminAuditLog(String eventType, String identifier, Long userId, String roles, String status, String details) {
        this.eventType = eventType;
        this.identifier = identifier;
        this.userId = userId;
        this.roles = roles;
        this.status = status;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
