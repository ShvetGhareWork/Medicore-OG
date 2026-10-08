package com.medicore.clinical.service;

import com.medicore.clinical.config.KafkaConfig;
import com.medicore.clinical.dto.ClinicalEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicalEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishClinicalEvent(ClinicalEventDto event) {
        if (event.getEventId() == null) {
            event.setEventId(UUID.randomUUID().toString());
        }
        String key = event.getPatientId() != null ? event.getPatientId().toString() : UUID.randomUUID().toString();
        log.info("Publishing clinical event {} for patient {} to topic {}", event.getEventType(), key, KafkaConfig.CLINICAL_EVENTS_TOPIC);
        kafkaTemplate.send(KafkaConfig.CLINICAL_EVENTS_TOPIC, key, event);
    }

    public void publishNurseFlagEvent(ClinicalEventDto event) {
        if (event.getEventId() == null) {
            event.setEventId(UUID.randomUUID().toString());
        }
        String key = event.getPatientId() != null ? event.getPatientId().toString() : UUID.randomUUID().toString();
        log.info("Publishing nurse flag event {} for patient {} to topic {}", event.getEventType(), key, KafkaConfig.CLINICAL_FLAGS_TOPIC);
        kafkaTemplate.send(KafkaConfig.CLINICAL_FLAGS_TOPIC, key, event);
    }
}
