package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.config.AppProperties;
import com.example.fullstacktemplate.model.JwtToken;
import com.example.fullstacktemplate.model.TokenType;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.TokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.transaction.Transactional;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;

@Service
public class TokenService {

    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    private final AppProperties appProperties;
    private final TokenRepository tokenRepository;
    private final CryptoService cryptoService;
    private final SecretKey secretKey;
    private final String algorithm;
    private final IvParameterSpec ivParameterSpec;

    public TokenService(AppProperties appProperties, TokenRepository tokenRepository, CryptoService cryptoService) throws NoSuchAlgorithmException {
        this.appProperties = appProperties;
        this.tokenRepository = tokenRepository;
        this.cryptoService = cryptoService;
        this.algorithm = "AES/CBC/PKCS5Padding";
        
        // ✅ FIX: Folosește chei FIXE în loc de aleatoare pentru development
        SecretKey tempSecretKey;
        IvParameterSpec tempIvParameterSpec;
        
        try {
            // Generează o cheie fixă din token secret pentru consistență
            String tokenSecret = appProperties.getAuth().getTokenSecret();
            if (tokenSecret != null && tokenSecret.length() >= 32) {
                // Folosește primii 32 bytes din token secret pentru AES-256
                byte[] keyBytes = tokenSecret.substring(0, 32).getBytes("UTF-8");
                tempSecretKey = new SecretKeySpec(keyBytes, "AES");
                
                // IV fix pentru development (în producție ar trebui să fie aleatoriu per token)
                byte[] ivBytes = tokenSecret.substring(0, 16).getBytes("UTF-8");
                tempIvParameterSpec = new IvParameterSpec(ivBytes);
                
                logger.info("✅ Using FIXED crypto keys derived from token secret");
            } else {
                logger.warn("⚠️ Token secret too short (need 32+ chars), using random keys (tokens will be invalid after restart)");
                tempSecretKey = cryptoService.generateKey(256);
                tempIvParameterSpec = cryptoService.generateInitializationVector();
            }
        } catch (Exception e) {
            logger.error("❌ Error setting up crypto keys, falling back to random", e);
            tempSecretKey = cryptoService.generateKey(256);
            tempIvParameterSpec = cryptoService.generateInitializationVector();
        }
        
        // Asignează valorile finale
        this.secretKey = tempSecretKey;
        this.ivParameterSpec = tempIvParameterSpec;
        
        // ✅ DEBUGGING ÎMBUNĂTĂȚIT
        logger.info("🔐 TokenService initializing...");
        
        String tokenSecret = appProperties.getAuth().getTokenSecret();
        if (tokenSecret == null || tokenSecret.trim().isEmpty()) {
            logger.error("❌ AUTH_TOKEN_SECRET is NULL or empty! This will cause JWT validation issues!");
            logger.error("   Please check application.yml configuration for 'app.auth.tokenSecret'");
        } else {
            logger.info("✅ TokenService initialized successfully");
            logger.info("   🔑 Token Secret length: {} chars", tokenSecret.length());
            logger.info("   🔑 Token Secret preview: {}...{}", 
                tokenSecret.substring(0, Math.min(20, tokenSecret.length())),
                tokenSecret.length() > 40 ? tokenSecret.substring(tokenSecret.length() - 20) : "");
        }
        
        // ✅ LOG CONFIGURAȚIA EXPIRARE
        logger.info("⏰ Token expiration configuration:");
        logger.info("   Access Token: {} ms ({} hours)", 
                appProperties.getAuth().getAccessTokenExpirationMsec(),
                appProperties.getAuth().getAccessTokenExpirationMsec() / 1000 / 60 / 60);
        logger.info("   Refresh Token: {} ms ({} days)", 
                appProperties.getAuth().getRefreshTokenExpirationMsec(),
                appProperties.getAuth().getRefreshTokenExpirationMsec() / 1000 / 60 / 60 / 24);
    }
    
    public String createJwtTokenValue(Long id, Duration expireIn) {
        return createJwtTokenValue(Long.toString(id), expireIn);
    }

    private String createJwtTokenValue(String subject, Duration expireIn) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expireIn.toMillis());
        
        logger.info("🔐 Creating JWT token for subject: {}", subject);
        logger.info("⏰ Token will expire at: {} (in {} ms)", expiryDate, expireIn.toMillis());
        
        try {
            String encryptedSubject = cryptoService.encrypt(algorithm, subject, secretKey, ivParameterSpec);
            logger.debug("🔒 Subject encrypted successfully");
            
            // ✅ FOLOSEȘTE TOKEN SECRET DIN CONFIGURAȚIE
            String tokenSecret = appProperties.getAuth().getTokenSecret();
            if (tokenSecret == null || tokenSecret.trim().isEmpty()) {
                logger.error("❌ Cannot create JWT: tokenSecret is null or empty!");
                throw new IllegalStateException("Token secret not configured properly");
            }
            
            String token = Jwts.builder()
                    .setSubject(encryptedSubject)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .setIssuer("Full-stack template")
                    .signWith(SignatureAlgorithm.HS512, tokenSecret)  // ✅ Folosește configurația
                    .compact();
            
            logger.info("✅ JWT token created successfully");
            logger.info("   📅 Issued at: {}", now);
            logger.info("   📅 Expires at: {}", expiryDate);
            logger.info("   ⏱️ Valid for: {} hours", expireIn.toHours());
            
            return token;
            
        } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidAlgorithmParameterException | InvalidKeyException | BadPaddingException | IllegalBlockSizeException e) {
            logger.error("❌ Error while creating jwt token for subject: {}", subject, e);
            throw new IllegalStateException("Error while creating jwt token", e);
        }
    }

    public Long getUserIdFromToken(String token) {
        logger.debug("🔍 Extracting user ID from token...");
        
        try {
            // Elimină prefixul "Bearer " dacă există
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                logger.debug("🔄 Removed Bearer prefix");
            }
            
            logger.debug("🔓 Parsing JWT token...");
            
            // ✅ FOLOSEȘTE TOKEN SECRET DIN CONFIGURAȚIE
            String tokenSecret = appProperties.getAuth().getTokenSecret();
            if (tokenSecret == null || tokenSecret.trim().isEmpty()) {
                logger.error("❌ Cannot parse JWT: tokenSecret is null or empty!");
                throw new IllegalStateException("Token secret not configured properly");
            }
            
            Claims claims = Jwts.parser()
                    .setSigningKey(tokenSecret)  // ✅ Folosește configurația
                    .parseClaimsJws(token)
                    .getBody();
            
            String encryptedSubject = claims.getSubject();
            logger.debug("🔒 Encrypted subject extracted, attempting decryption...");
            
            if (encryptedSubject == null || encryptedSubject.isEmpty()) {
                logger.error("❌ Subject is null or empty in token claims");
                throw new IllegalStateException("Subject is null or empty in token");
            }
            
            String decryptedSubject = cryptoService.decrypt(algorithm, encryptedSubject, secretKey, ivParameterSpec);
            logger.debug("🔓 Subject decrypted: {}", decryptedSubject);
            
            Long userId = Long.parseLong(decryptedSubject);
            logger.info("✅ Successfully extracted user ID: {}", userId);
            
            return userId;
            
        } catch (NoSuchPaddingException | NoSuchAlgorithmException | InvalidAlgorithmParameterException | InvalidKeyException | BadPaddingException | IllegalBlockSizeException e) {
            logger.error("❌ Cryptographic error while getting id from token", e);
            throw new IllegalStateException("Error while getting id from token", e);
        } catch (ExpiredJwtException e) {
            logger.error("❌ JWT token is expired: expired at {} vs current time {}", 
                    e.getClaims().getExpiration(), new Date());
            throw new IllegalStateException("Token expired", e);
        } catch (JwtException e) {
            logger.error("❌ JWT parsing error", e);
            throw new IllegalStateException("Invalid JWT token", e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error while getting id from token", e);
            throw new IllegalStateException("Error while getting id from token", e);
        }
    }

    public boolean validateJwtToken(String jwtToken) {
        try {
            // Elimină prefixul "Bearer " dacă există
            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                jwtToken = jwtToken.substring(7);
            }
            
            // ✅ FOLOSEȘTE TOKEN SECRET DIN CONFIGURAȚIE
            String tokenSecret = appProperties.getAuth().getTokenSecret();
            if (tokenSecret == null || tokenSecret.trim().isEmpty()) {
                logger.error("❌ Cannot validate JWT: tokenSecret is null or empty!");
                return false;
            }
            
            Claims claims = Jwts.parser()
                .setSigningKey(tokenSecret)  // ✅ Folosește configurația
                .parseClaimsJws(jwtToken)
                .getBody();
                
            logger.debug("✅ JWT token is valid, expires at: {}", claims.getExpiration());
            return true;
            
        } catch (SignatureException ex) {
            logger.error("❌ Invalid JWT signature", ex);
        } catch (MalformedJwtException ex) {
            logger.error("❌ Invalid JWT token", ex);
        } catch (ExpiredJwtException ex) {
            logger.error("❌ Expired JWT token: expired at {} vs current time {}", 
                    ex.getClaims().getExpiration(), new Date());
        } catch (UnsupportedJwtException ex) {
            logger.error("❌ Unsupported JWT token", ex);
        } catch (IllegalArgumentException ex) {
            logger.error("❌ JWT claims string is empty", ex);
        }
        return false;
    }

    @Transactional
    public JwtToken createToken(User user, Duration expireIn, TokenType tokenType) {
        logger.info("🔐 Creating {} token for user: {} with expiration: {} ms", 
                tokenType, user.getEmail(), expireIn.toMillis());
        
        String tokenValue = createJwtTokenValue(user.getId(), expireIn);
        JwtToken jwtToken = new JwtToken();
        jwtToken.setValue(tokenValue);
        jwtToken.setUser(user);
        jwtToken.setTokenType(tokenType);
        
        JwtToken saved = tokenRepository.save(jwtToken);
        logger.info("💾 {} token saved to database with ID: {}", tokenType, saved.getId());
        
        return saved;
    }

    public void delete(JwtToken jwtToken) {
        logger.info("🗑️ Deleting token ID: {} of type: {}", jwtToken.getId(), jwtToken.getTokenType());
        tokenRepository.delete(jwtToken);
    }
}