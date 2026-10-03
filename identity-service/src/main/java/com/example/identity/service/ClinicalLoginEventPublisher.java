package com.example.identity.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ClinicalLoginEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(ClinicalLoginEventPublisher.class);
    private static final String TOPIC = "auth.clinical.events";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public ClinicalLoginEventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishSuccess(String staffId, String role, String clientIp) {
        try {
            String payload = """
                {
                  "event": "ClinicalLoginSucceeded",
                  "staffId": "%s",
                  "role": "%s",
                  "clientIp": "%s",
                  "timestamp": "%s"
                }
                """.formatted(
                    staffId != null ? staffId : "UNKNOWN",
                    role != null ? role : "UNKNOWN",
                    clientIp != null ? clientIp : "UNKNOWN",
                    LocalDateTime.now()
            );
            // Fire-and-forget: async non-blocking
            kafkaTemplate.send(TOPIC, staffId, payload);
            log.debug("Published ClinicalLoginSucceeded event for staffId: {}", staffId);
        } catch (Exception e) {
            log.warn("Failed to publish ClinicalLoginSucceeded event to Kafka: {}", e.getMessage());
        }
    }

    public void publishFailure(String staffId, String reason, String clientIp) {
        try {
            String payload = """
                {
                  "event": "ClinicalLoginFailed",
                  "staffId": "%s",
                  "reason": "%s",
                  "clientIp": "%s",
                  "timestamp": "%s"
                }
                """.formatted(
                    staffId != null ? staffId : "UNKNOWN",
                    reason != null ? reason : "UNKNOWN",
                    clientIp != null ? clientIp : "UNKNOWN",
                    LocalDateTime.now()
            );
            kafkaTemplate.send(TOPIC, staffId, payload);
            log.debug("Published ClinicalLoginFailed event for staffId: {}", staffId);
        } catch (Exception e) {
            log.warn("Failed to publish ClinicalLoginFailed event to Kafka: {}", e.getMessage());
        }
    }
}
