package com.example.insurance.listener;

import com.example.insurance.dto.PatientCreatedEvent;
import com.example.insurance.entity.Insurance;
import com.example.insurance.repository.InsuranceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class PatientCreatedListener {

    private static final Logger log = LoggerFactory.getLogger(PatientCreatedListener.class);

    private final InsuranceRepository insuranceRepository;

    public PatientCreatedListener(InsuranceRepository insuranceRepository) {
        this.insuranceRepository = insuranceRepository;
    }

    @KafkaListener(topics = "patient-created", groupId = "insurance-group")
    public void handlePatientCreated(PatientCreatedEvent event) {
        log.info("Received patient-created event for patient: id={}, name={} {}, email={}",
                event.getPatientId(), event.getFirstName(), event.getLastName(), event.getEmail());

        // Check if insurance already exists for patient
        if (insuranceRepository.findByPatientId(event.getPatientId()).isEmpty()) {
            Insurance defaultInsurance = Insurance.builder()
                    .policyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .provider("Default Healthcare Coverage")
                    .validUntil(LocalDate.now().plusYears(1))
                    .patientId(event.getPatientId())
                    .build();

            insuranceRepository.save(defaultInsurance);
            log.info("Auto-provisioned default insurance for patientId: {}", event.getPatientId());
        }
    }

    @KafkaListener(topics = "patient-created.DLT", groupId = "insurance-dlt-group")
    public void handlePatientCreatedDlt(PatientCreatedEvent event) {
        log.error("CRITICAL DLT ALERT: Message quarantined in Dead Letter Topic for patientId: {}. Requires admin inspection.",
                event.getPatientId());
    }
}
