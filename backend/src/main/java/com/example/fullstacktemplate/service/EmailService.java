package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.config.AppProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
@Component
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;
    private final AppProperties appProperties;

    // SCHIMBAT: Adăugat default value pentru a evita eroarea
    @Value("${app.email.from:${EMAIL_USERNAME:andrabogde@yahoo.com}}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender emailSender, AppProperties appProperties) {
        this.emailSender = emailSender;
        this.appProperties = appProperties;
        log.info("📧 EmailService initialized");
    }

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        log.info("📧 Sending simple email to: {}", to);
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        
        try {
            emailSender.send(message);
            log.info("✅ Simple email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("❌ Failed to send simple email to: {}", to, e);
            throw e;
        }
    }

    /**
     * Trimite email pentru resetarea parolei
     */
    @Async
    public void sendPasswordResetEmail(String to, String resetUrl, String userName) {
        log.info("🔑 Sending password reset email to: {} from: {}", to, fromEmail);
        
        String subject = appProperties.getAppName() + " - Resetare Parolă";
        
        String emailBody = String.format(
            "Salut %s,\n\n" +
            "Ai solicitat resetarea parolei pentru contul tău %s.\n\n" +
            "Pentru a-ți reseta parola, dă click pe linkul de mai jos:\n" +
            "%s\n\n" +
            "Acest link va expira în %d minute.\n\n" +
            "Dacă nu ai solicitat resetarea parolei, ignoră acest email.\n\n" +
            "Cu respect,\n" +
            "Echipa %s",
            userName != null ? userName : "Utilizator",
            appProperties.getAppName(),
            resetUrl,
            appProperties.getAuth().getVerificationTokenExpirationMsec() / (1000 * 60), // convert to minutes
            appProperties.getAppName()
        );

        log.info("📝 Email content prepared for: {}", to);
        log.debug("🔗 Reset URL: {}", resetUrl);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(emailBody);
        
        try {
            log.info("📤 Attempting to send password reset email via Gmail SMTP...");
            emailSender.send(message);
            log.info("✅ Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to: {}", to, e);
            log.error("💡 Make sure your Gmail App Password is correct and 2FA is enabled!");
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        }
    }

    /**
     * METODĂ DE TEST - Pentru a verifica dacă Gmail SMTP funcționează
     */
    @Async
    public void sendTestEmail(String to) {
        log.info("🧪 Sending test email to: {} via Gmail", to);
        
        String subject = "Test Email - " + appProperties.getAppName();
        String body = "🎉 Felicitări!\n\n" +
                     "Configurația Gmail SMTP funcționează corect!\n\n" +
                     "Detalii:\n" +
                     "- From: " + fromEmail + "\n" +
                     "- To: " + to + "\n" +
                     "- Server: smtp.gmail.com:587\n" +
                     "- STARTTLS: Enabled\n\n" +
                     "Acum poți trimite email-uri pentru resetarea parolei.\n\n" +
                     "Cu respect,\n" +
                     "Echipa " + appProperties.getAppName();

        sendSimpleMessage(to, subject, body);
    }
}