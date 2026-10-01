package com.example.identity.security;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@Component
public class TotpUtil {

    private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private static final int TIME_STEP_SECONDS = 30;
    private static final int CODE_DIGITS = 6;
    private static final int DIGITS_POWER = 1000000; // 10^6

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateSecret() {
        byte[] buffer = new byte[20]; // 160-bit secret
        secureRandom.nextBytes(buffer);
        return encodeBase32(buffer);
    }

    public String getQrCodeUri(String username, String secret) {
        String encodedIssuer = URLEncoder.encode("MediCore Healthcare", StandardCharsets.UTF_8);
        String encodedAccount = URLEncoder.encode(username, StandardCharsets.UTF_8);
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30",
                encodedIssuer, encodedAccount, secret, encodedIssuer
        );
    }

    public boolean verifyCode(String secret, String code) {
        if (secret == null || code == null || code.trim().length() != CODE_DIGITS) {
            return false;
        }

        long currentInterval = System.currentTimeMillis() / 1000 / TIME_STEP_SECONDS;

        // Check ±1 window (covering previous, current, and next 30s window)
        for (int i = -1; i <= 1; i++) {
            String expectedCode = generateCode(secret, currentInterval + i);
            if (expectedCode.equals(code.trim())) {
                return true;
            }
        }
        return false;
    }

    public String generateCode(String secret, long interval) {
        try {
            byte[] key = decodeBase32(secret);
            byte[] data = ByteBuffer.allocate(8).putLong(interval).array();

            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(key, "RAW"));
            byte[] hash = mac.doFinal(data);

            int offset = hash[hash.length - 1] & 0xF;
            int binary = ((hash[offset] & 0x7F) << 24)
                    | ((hash[offset + 1] & 0xFF) << 16)
                    | ((hash[offset + 2] & 0xFF) << 8)
                    | (hash[offset + 3] & 0xFF);

            int otp = binary % DIGITS_POWER;
            return String.format("%06d", otp);
        } catch (Exception e) {
            throw new RuntimeException("Error computing TOTP code", e);
        }
    }

    private String encodeBase32(byte[] data) {
        StringBuilder result = new StringBuilder();
        int buffer = 0;
        int bitsLeft = 0;

        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xFF);
            bitsLeft += 8;
            while (bitsLeft >= 5) {
                int index = (buffer >> (bitsLeft - 5)) & 0x1F;
                result.append(BASE32_CHARS.charAt(index));
                bitsLeft -= 5;
            }
        }

        if (bitsLeft > 0) {
            int index = (buffer << (5 - bitsLeft)) & 0x1F;
            result.append(BASE32_CHARS.charAt(index));
        }

        return result.toString();
    }

    private byte[] decodeBase32(String secret) {
        String normalized = secret.trim().toUpperCase().replaceAll("[^A-Z2-7]", "");
        ByteBuffer byteBuffer = ByteBuffer.allocate(normalized.length() * 5 / 8);

        int buffer = 0;
        int bitsLeft = 0;

        for (char c : normalized.toCharArray()) {
            int val = BASE32_CHARS.indexOf(c);
            if (val == -1) continue;

            buffer = (buffer << 5) | val;
            bitsLeft += 5;

            if (bitsLeft >= 8) {
                byteBuffer.put((byte) (buffer >> (bitsLeft - 8)));
                bitsLeft -= 8;
            }
        }

        byteBuffer.flip();
        byte[] result = new byte[byteBuffer.remaining()];
        byteBuffer.get(result);
        return result;
    }
}
