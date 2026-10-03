package com.example.identity.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class StaffCredentialEmailService {

    private static final Logger log = LoggerFactory.getLogger(StaffCredentialEmailService.class);

    private final JavaMailSender mailSender;
    private final String frontendBaseUrl;
    private final String mailUsername;
    private final String mailPassword;

    public StaffCredentialEmailService(
            JavaMailSender mailSender,
            @Value("${app.frontend.base-url:http://localhost:3000}") String frontendBaseUrl,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword) {
        this.mailSender = mailSender;
        this.frontendBaseUrl = frontendBaseUrl;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
    }

    public void sendWelcomeCredentials(String toEmail, String fullName,
                                       String staffId, String badgeToken, String role) throws Exception {
        log.info("Preparing welcome credentials email for staffId: {}, email: {}", staffId, toEmail);

        if (mailUsername == null || mailUsername.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            log.warn("⚠️ [SMTP DISABLED] MAIL_USERNAME / MAIL_PASSWORD not configured. Simulated credential delivery for staffId: {}, email: {}, badgeToken: {}", staffId, toEmail, badgeToken);
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

        helper.setFrom(mailUsername);
        helper.setTo(toEmail);
        helper.setSubject("Welcome to MediCore — Your Clinical Terminal Login Credentials");

        // QR payload format parsed by the bedside terminal scanner
        String qrPayload = "{\"staffId\":\"" + staffId + "\",\"badgeToken\":\"" + badgeToken + "\"}";
        byte[] qrPng = generateQrPng(qrPayload, 280, 280);
        String base64Qr = Base64.getEncoder().encodeToString(qrPng);

        String loginUrl = frontendBaseUrl + "/clinical/login";
        String plainText = buildPlainText(fullName, staffId, role, badgeToken, loginUrl);
        String html = buildHtml(fullName, staffId, role, badgeToken, loginUrl, base64Qr);

        // In Spring MimeMessageHelper: setText MUST be called before addInline
        helper.setText(plainText, html);

        // Attach as inline CID image (fallback if client supports CID)
        try {
            helper.addInline("qrcode", new ByteArrayResource(qrPng), "image/png");
        } catch (Exception e) {
            log.warn("Could not add inline CID image: {}", e.getMessage());
        }

        mailSender.send(message);
        log.info("✅ Welcome credentials email successfully dispatched via SMTP to {}", toEmail);
    }

    public byte[] generateQrPng(String content, int width, int height) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
        return baos.toByteArray();
    }

    private String buildPlainText(String fullName, String staffId, String role, String badgeToken, String loginUrl) {
        String name = fullName != null ? fullName : "Clinical Staff Member";
        String r = role != null ? role.replace("_", " ") : "STAFF";
        return """
            MediCore Health System - Clinical Credentials
            ==============================================

            Hello %s,

            Your clinical terminal credentials have been provisioned.

            - Role: %s
            - Staff ID: %s
            - Badge Token (Manual Entry): %s

            Clinical Terminal Login URL:
            %s

            Please use your Staff ID and Badge Token or scan your QR code at any bedside workstation.
            This email is confidential. Do not forward or share your credentials.
            """.formatted(name, r, staffId, badgeToken, loginUrl);
    }

    private String buildHtml(String fullName, String staffId, String role, String badgeToken, String loginUrl, String base64Qr) {
        String sanitizedName = fullName != null ? fullName : "Clinical Staff Member";
        String sanitizedRole = role != null ? role.replace("_", " ") : "STAFF";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>MediCore Clinical Credentials</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #334155;">
              <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 32px 12px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                      
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0284c7 0%%, #0d9488 100%%); background-color: #0284c7; padding: 36px 24px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MediCore Health System</h1>
                          <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px; font-weight: 500;">Clinical Point-of-Care Terminal Access</p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding: 36px 32px;">
                          <p style="margin: 0 0 16px 0; font-size: 16px; color: #1e293b;">Hello <strong style="color: #0f172a;">%s</strong>,</p>
                          <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                            An administrative account has provisioned your credentials for bedside and clinical station computers. Use your scannable QR badge or your Staff ID to sign in to the Clinical Terminal.
                          </p>

                          <!-- Details Card -->
                          <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 28px;">
                            <tr>
                              <td style="padding: 20px 24px;">
                                <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                                  <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 40%%;">Role</td>
                                    <td style="padding: 8px 0; color: #0284c7; font-weight: 600; text-align: right; width: 60%%;">%s</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 500; border-top: 1px solid #e2e8f0;">Staff ID</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-family: monospace; font-size: 15px; font-weight: 700; text-align: right; border-top: 1px solid #e2e8f0;">%s</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 500; border-top: 1px solid #e2e8f0;">Badge Token (Manual)</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-family: monospace; font-size: 13px; text-align: right; word-break: break-all; border-top: 1px solid #e2e8f0;">%s</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- QR Viewfinder Section -->
                          <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; text-align: center;">
                            <tr>
                              <td align="center">
                                <p style="margin: 0 0 14px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7;">
                                  Scan at Bedside Camera to Login
                                </p>
                                <div style="display: inline-block; padding: 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">
                                  <img src="data:image/png;base64,%s" alt="Staff Login QR Code" width="200" height="200" style="display: block; border: none; max-width: 100%%; height: auto;" />
                                </div>
                              </td>
                            </tr>
                          </table>

                          <!-- Direct Link Button -->
                          <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; text-align: center;">
                            <tr>
                              <td align="center">
                                <a href="%s" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 6px; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);">
                                  Open Clinical Terminal
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                            Confidential medical staff credential. Do not forward or share this QR code with unauthorized personnel.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
                          MediCore Hospital Information System • Automatic Security Notification
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(sanitizedName, sanitizedRole, staffId, badgeToken, base64Qr, loginUrl);
    }
}