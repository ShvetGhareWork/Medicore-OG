package com.example.identity.service;

import com.example.identity.dto.CreatePatientRequest;
import com.example.identity.dto.PatientResponse;
import com.example.identity.entity.Department;
import com.example.identity.entity.Patient;
import com.example.identity.entity.Staff;
import com.example.identity.entity.type.AdmissionStatusType;
import com.example.identity.repository.DepartmentRepository;
import com.example.identity.repository.PatientRepository;
import com.example.identity.repository.StaffRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;

    public PatientService(PatientRepository patientRepository, StaffRepository staffRepository, DepartmentRepository departmentRepository) {
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public String generatePatientId() {
        int currentYear = Year.now().getValue();
        String prefixYear = "PT-" + currentYear;
        String pattern = prefixYear + "-%";

        List<String> existingPatientIds = patientRepository.findPatientIdsForPrefixWithLock(pattern);

        int maxSeq = 0;
        for (String pid : existingPatientIds) {
            if (pid != null && pid.startsWith(prefixYear + "-")) {
                String seqStr = pid.substring((prefixYear + "-").length());
                try {
                    int seq = Integer.parseInt(seqStr);
                    if (seq > maxSeq) {
                        maxSeq = seq;
                    }
                } catch (NumberFormatException ignored) {
                }
            }
        }

        int newSeq = maxSeq + 1;
        return String.format("%s-%04d", prefixYear, newSeq);
    }

    @Transactional
    public PatientResponse createPatient(CreatePatientRequest request) {
        AdmissionStatusType status = request.getAdmissionStatus() != null ? request.getAdmissionStatus() : AdmissionStatusType.PENDING;

        // Bed occupancy validation check for ADMITTED status
        if (status == AdmissionStatusType.ADMITTED && request.getWardNumber() != null && request.getBedNumber() != null) {
            if (patientRepository.existsByWardNumberAndBedNumberAndAdmissionStatus(
                    request.getWardNumber(), request.getBedNumber(), AdmissionStatusType.ADMITTED)) {
                throw new IllegalArgumentException("Bed " + request.getBedNumber() + " in Ward " + request.getWardNumber() + " is currently occupied.");
            }
        }

        Staff doctor = null;
        if (request.getAttendingDoctorId() != null) {
            doctor = staffRepository.findById(request.getAttendingDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("Attending doctor not found with ID: " + request.getAttendingDoctorId()));
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));
        } else if (request.getDepartmentName() != null && !request.getDepartmentName().isBlank()) {
            department = departmentRepository.findByNameIgnoreCase(request.getDepartmentName())
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName(request.getDepartmentName());
                        d.setCode(request.getDepartmentName().toUpperCase().replaceAll("[^A-Z]", ""));
                        return departmentRepository.save(d);
                    });
        }

        String patientId = generatePatientId();

        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setFullName(request.getFullName());
        patient.setEmail(request.getEmail());
        patient.setContactNumber(request.getContactNumber());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        patient.setAdmittingDiagnosis(request.getAdmittingDiagnosis());
        patient.setTriageLevel(request.getTriageLevel());
        patient.setAttendingDoctor(doctor);
        patient.setDepartment(department);
        patient.setWardNumber(request.getWardNumber());
        patient.setBedNumber(request.getBedNumber());
        patient.setAdmissionStatus(status);
        patient.setAdmissionDate(request.getAdmissionDate() != null ? request.getAdmissionDate() : (status == AdmissionStatusType.ADMITTED ? LocalDateTime.now() : null));
        patient.setExpectedDischargeDate(request.getExpectedDischargeDate());

        Patient saved = patientRepository.save(patient);
        return mapToPatientResponse(saved);
    }

    public Page<PatientResponse> getPatients(AdmissionStatusType status, String search, Pageable pageable) {
        Specification<Patient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("admissionStatus"), status));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("fullName")), pattern),
                        cb.like(cb.lower(root.get("patientId")), pattern),
                        cb.like(cb.lower(root.get("admittingDiagnosis")), pattern)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return patientRepository.findAll(spec, pageable).map(this::mapToPatientResponse);
    }

    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + id));
        return mapToPatientResponse(patient);
    }

    public PatientResponse mapToPatientResponse(Patient patient) {
        Long doctorId = patient.getAttendingDoctor() != null ? patient.getAttendingDoctor().getId() : null;
        String doctorName = patient.getAttendingDoctor() != null ? patient.getAttendingDoctor().getFullName() : null;
        Long deptId = patient.getDepartment() != null ? patient.getDepartment().getId() : null;
        String deptName = patient.getDepartment() != null ? patient.getDepartment().getName() : null;

        return new PatientResponse(
                patient.getId(),
                patient.getPatientId(),
                patient.getFullName(),
                patient.getEmail(),
                patient.getContactNumber(),
                patient.getDateOfBirth(),
                patient.getGender(),
                patient.getAddress(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactPhone(),
                patient.getAdmittingDiagnosis(),
                patient.getTriageLevel(),
                doctorId,
                doctorName,
                deptId,
                deptName,
                patient.getWardNumber(),
                patient.getBedNumber(),
                patient.getAdmissionStatus(),
                patient.getAdmissionDate(),
                patient.getExpectedDischargeDate(),
                patient.getCreatedAt(),
                patient.getUpdatedAt()
        );
    }
}
