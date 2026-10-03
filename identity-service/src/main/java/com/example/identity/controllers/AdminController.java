package com.example.identity.controllers;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffListItemResponse;
import com.example.identity.dto.StaffResponse;
import com.example.identity.dto.UpdateStaffRequest;
import com.example.identity.entity.type.RoleType;
import com.example.identity.entity.type.StaffStatusType;
import com.example.identity.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.identity.entity.AdminAuditLog;
import com.example.identity.service.AdminAuditLogService;

@RestController
@RequestMapping("/admin/staff")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StaffService staffService;
    private final AdminAuditLogService auditLogService;

    public AdminController(StaffService staffService, AdminAuditLogService auditLogService) {
        this.staffService = staffService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AdminAuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getAuditLogs(pageable));
    }

    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        StaffResponse response = staffService.createStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<StaffListItemResponse>> getStaffList(
            @RequestParam(required = false) RoleType role,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) StaffStatusType status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StaffListItemResponse> response = staffService.getStaffList(role, department, status, search, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable String id) {
        return ResponseEntity.ok(staffService.getStaffByIdentifier(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(@PathVariable String id, @Valid @RequestBody UpdateStaffRequest request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<StaffResponse> deactivateStaff(@PathVariable String id) {
        return ResponseEntity.ok(staffService.deactivateStaff(id));
    }

    @PostMapping("/{id}/resend-credentials")
    public ResponseEntity<StaffResponse> resendCredentials(@PathVariable String id) {
        return ResponseEntity.ok(staffService.resendCredentials(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, Object>> deleteStaff(@PathVariable String id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Staff member deleted successfully", "id", id));
    }
}
