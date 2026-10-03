package com.example.identity.service;

import com.example.identity.entity.ProcessedEvent;
import com.example.identity.entity.User;
import com.example.identity.repository.ProcessedEventRepository;
import com.example.identity.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class StaffCredentialEmailConsumer {

    private static final Logger log = LoggerFactory.getLogger(StaffCredentialEmailConsumer.class);
    private static final String CONSUMER_GROUP = "credential-email-sender";

    private final UserRepository userRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final StaffCredentialEmailService emailService;
    private final ObjectMapper objectMapper;

    public StaffCredentialEmailConsumer(
            UserRepository userRepository,
            ProcessedEventRepository processedEventRepository,
            StaffCredentialEmailService emailService,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.processedEventRepository = processedEventRepository;
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
            topics = "staff.created",
            groupId = CONSUMER_GROUP,
            containerFactory = "kafkaListenerContainerFactory"
    )
    @Transactional
    public void onStaffCreated(ConsumerRecord<String, String> record) {
        log.info("Received staff.created Kafka message: key={}", record.key());

        Map<String, String> eventData;
        try {
            eventData = objectMapper.readValue(record.value(), new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            log.error("Failed to parse staff.created payload: {}", record.value(), e);
            throw new RuntimeException("Invalid payload format", e);
        }

        String eventId = eventData.get("eventId");
        String staffId = eventData.get("staffId");
        String role = eventData.get("role");

        if (eventId == null || staffId == null) {
            log.warn("Missing eventId or staffId in payload, skipping record");
            return;
        }

        // Idempotency check
        if (processedEventRepository.existsByEventIdAndConsumerGroup(eventId, CONSUMER_GROUP)) {
            log.info("Event {} has already been processed by {}, skipping", eventId, CONSUMER_GROUP);
            return;
        }

        // Retrieve user and badgeToken from database (securely separated from Kafka payload)
        User user = userRepository.findByStaffId(staffId)
                .orElseThrow(() -> new IllegalStateException("User record not found for staffId: " + staffId));

        if (user.getBadgeToken() == null || user.getBadgeToken().isBlank()) {
            log.warn("User {} has no badgeToken configured", staffId);
            return;
        }

        try {
            emailService.sendWelcomeCredentials(
                    user.getEmail(),
                    user.getFullName(),
                    staffId,
                    user.getBadgeToken(),
                    role != null ? role : (user.getRoles().isEmpty() ? "STAFF" : user.getRoles().iterator().next().name())
            );

            // Record as processed
            ProcessedEvent processedEvent = new ProcessedEvent();
            processedEvent.setEventId(eventId);
            processedEvent.setConsumerGroup(CONSUMER_GROUP);
            processedEvent.setProcessedAt(LocalDateTime.now());
            processedEventRepository.save(processedEvent);

            log.info("Successfully processed staff.created event {} for staffId {}", eventId, staffId);
        } catch (Exception e) {
            log.error("Failed to send welcome credentials for staffId {}: {}", staffId, e.getMessage(), e);
            throw new RuntimeException("Email dispatch failed, triggering Kafka retry", e);
        }
    }
}
