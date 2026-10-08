package com.medicore.clinical.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String IDEMPOTENCY_PREFIX = "idempotency:";

    /**
     * Attempts to acquire an idempotency key lock with a 24-hour expiration.
     * @return true if key was acquired (first request), false if already exists (duplicate request)
     */
    public boolean acquire(String key, String responseSnapshot) {
        if (key == null || key.isBlank()) return true;
        try {
            Boolean success = redisTemplate.opsForValue().setIfAbsent(
                    IDEMPOTENCY_PREFIX + key,
                    responseSnapshot != null ? responseSnapshot : "PROCESSING",
                    Duration.ofHours(24)
            );
            return Boolean.TRUE.equals(success);
        } catch (Exception e) {
            log.warn("Redis unavailable for idempotency check, bypassing: {}", e.getMessage());
            return true;
        }
    }

    public void updateResponse(String key, String responseSnapshot) {
        if (key == null || key.isBlank()) return;
        try {
            redisTemplate.opsForValue().set(
                    IDEMPOTENCY_PREFIX + key,
                    responseSnapshot,
                    Duration.ofHours(24)
            );
        } catch (Exception e) {
            log.warn("Failed to update idempotency response: {}", e.getMessage());
        }
    }

    public String getCachedResponse(String key) {
        if (key == null || key.isBlank()) return null;
        try {
            return redisTemplate.opsForValue().get(IDEMPOTENCY_PREFIX + key);
        } catch (Exception e) {
            return null;
        }
    }
}
