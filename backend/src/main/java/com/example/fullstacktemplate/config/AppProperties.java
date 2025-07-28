package com.example.fullstacktemplate.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app")
@Component  // ✅ ADĂUGAT - NECESAR pentru citirea din application.yml
@Data
@Slf4j
public class AppProperties {
    
    // Proprietăți principale
    private String name = "SunnySeat";
    private String frontEndUri = "http://localhost:4000";
    private long deleteExpiredTokensDelayMsec = 30000;
    private long updatePlaceDetailsDelayMsec = 1800000;
    private long maxRequestSize = 200000000;
    
    // URIs pentru email-uri
    private String accountActivationUri;
    private String emailChangeConfirmationUri;
    private String passwordResetUri;
    
    // Email settings
    private String emailFrom;
    private String emailFromName;
    
    // Liste pentru OAuth
    private List<String> allowedOrigins = new ArrayList<>();
    private List<String> authorizedRedirectUris = new ArrayList<>();
    
    // Configurația de autentificare
    private final Auth auth = new Auth();
    private final Tomcat tomcat = new Tomcat();

    @Data
    public static class Auth {
        // ✅ SETEAZĂ VALORI DEFAULT REALISTE
        private long accessTokenExpirationMsec = 86400000;    // 24 ore default
        private long refreshTokenExpirationMsec = 604800000; // 7 zile default
        private long verificationTokenExpirationMsec = 3600000; // 1 oră default
        private String tokenSecret = "ThisIsAVeryLongAndSecureJwtSecretKeyForHS512AlgorithmThatHasMoreThan64CharactersAndIsCompletelySecureForProduction123456789";
    }

    @Data
    public static class Tomcat {
        private String connectionTimeout = "5s";
    }

    // Getter pentru compatibilitate
    public String getAppName() {
        return name;
    }
    
    // ✅ LOG CONFIGURAȚIA LA INIȚIALIZARE
    @PostConstruct
    public void logConfiguration() {
        log.info("🚀 APP PROPERTIES LOADED:");
        log.info("   📱 App Name: {}", name);
        log.info("   🌐 Frontend URI: {}", frontEndUri);
        log.info("   📧 Email From: {}", emailFrom);
        log.info("   🔗 Account Activation URI: {}", accountActivationUri);
        
        log.info("🔧 AUTH CONFIGURATION:");
        log.info("   📊 Access Token Expiration: {} ms ({} hours)", 
                auth.accessTokenExpirationMsec, auth.accessTokenExpirationMsec / 1000 / 60 / 60);
        log.info("   📊 Refresh Token Expiration: {} ms ({} days)", 
                auth.refreshTokenExpirationMsec, auth.refreshTokenExpirationMsec / 1000 / 60 / 60 / 24);
        log.info("   📊 Verification Token Expiration: {} ms ({} hours)", 
                auth.verificationTokenExpirationMsec, auth.verificationTokenExpirationMsec / 1000 / 60 / 60);
        log.info("   🔑 Token Secret configured: {}", auth.tokenSecret != null ? "YES" : "NO");
        
        if (auth.tokenSecret != null) {
            log.info("   🔑 Token Secret length: {} chars", auth.tokenSecret.length());
            log.info("   🔑 Token Secret preview: {}...{}", 
                    auth.tokenSecret.substring(0, Math.min(20, auth.tokenSecret.length())),
                    auth.tokenSecret.length() > 40 ? auth.tokenSecret.substring(auth.tokenSecret.length() - 20) : "");
        }
    }
}