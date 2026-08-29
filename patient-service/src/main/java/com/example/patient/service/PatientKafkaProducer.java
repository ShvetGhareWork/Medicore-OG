package com.example.patient.service;

import com.example.patient.dto.PatientCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PatientKafkaProducer {

    private static final Logger log = LoggerFactory.getLogger(PatientKafkaProducer.class);
    private static final String TOPIC = "patient-created";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PatientKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendPatientCreatedEvent(PatientCreatedEvent event) {
        try {
            log.info("Publishing patient-created event for patientId: {}", event.getPatientId());
            kafkaTemplate.send(TOPIC, String.valueOf(event.getPatientId()), event);
        } catch (Exception e) {
            log.error("Failed to publish patient-created event to Kafka: {}", e.getMessage());
        }
    }
}
