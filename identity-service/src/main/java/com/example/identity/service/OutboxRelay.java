package com.example.identity.service;

import com.example.identity.entity.OutboxEvent;
import com.example.identity.repository.OutboxEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OutboxRelay {

    private static final Logger log = LoggerFactory.getLogger(OutboxRelay.class);

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OutboxRelay(OutboxEventRepository outboxEventRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.outboxEventRepository = outboxEventRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void relayEvents() {
        List<OutboxEvent> unsentEvents = outboxEventRepository.findTop50BySentAtIsNullOrderByCreatedAtAsc();
        if (unsentEvents.isEmpty()) {
            return;
        }

        for (OutboxEvent event : unsentEvents) {
            try {
                kafkaTemplate.send(event.getTopic(), event.getMessageKey(), event.getPayload())
                        .whenComplete((result, ex) -> {
                            if (ex == null) {
                                event.setSentAt(LocalDateTime.now());
                                outboxEventRepository.save(event);
                                log.debug("Relayed outbox event {} to topic {}", event.getId(), event.getTopic());
                            } else {
                                log.error("Failed to relay outbox event {} to topic {}: {}", event.getId(), event.getTopic(), ex.getMessage());
                            }
                        });
            } catch (Exception e) {
                log.error("Error attempting to send outbox event {}: {}", event.getId(), e.getMessage());
            }
        }
    }
}
