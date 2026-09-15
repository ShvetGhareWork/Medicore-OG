package com.example.identity.controllers;

import com.example.identity.dto.CreateStaffRequest;
import com.example.identity.dto.StaffListItemResponse;
import com.example.identity.dto.StaffResponse;
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

@RestController
@RequestMapping("/admin/staff")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StaffService staffService;

    public AdminController(StaffService staffService) {
        this.staffService = staffService;
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
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<StaffResponse> deactivateStaff(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.deactivateStaff(id));
    }
}
