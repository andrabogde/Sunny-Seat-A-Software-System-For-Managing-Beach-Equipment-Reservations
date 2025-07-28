package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.config.AppProperties;
import com.example.fullstacktemplate.config.security.UserPrincipal;
import com.example.fullstacktemplate.dto.*;
import com.example.fullstacktemplate.dto.mapper.UserMapper;
import com.example.fullstacktemplate.exception.BadRequestException;
import com.example.fullstacktemplate.exception.UnauthorizedRequestException;
import com.example.fullstacktemplate.model.*;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.FavoriteRepository;
import com.example.fullstacktemplate.repository.FirmaRepository;
import com.example.fullstacktemplate.repository.NotificareRepository;
import com.example.fullstacktemplate.repository.RezervareRepository;
import com.example.fullstacktemplate.repository.TokenRepository;
import com.example.fullstacktemplate.repository.TwoFactoryRecoveryCodeRepository;
import com.example.fullstacktemplate.repository.UserRepository;
import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.recovery.RecoveryCodeGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // ADĂUGAT IMPORT
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URLEncoder; // ADĂUGAT IMPORT
import java.nio.charset.StandardCharsets; // ADĂUGAT IMPORT
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final FileDbService fileDbService;
    private final SecretGenerator twoFactorSecretGenerator;
    private final TokenRepository tokenRepository;
    private final AppProperties appProperties;
    private final TokenService tokenService;
    private final ResourceLoader resourceLoader;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final UserMapper userMapper;
    private final TwoFactoryRecoveryCodeRepository twoFactoryRecoveryCodeRepository;
    private final MessageService messageService;
    private final CerereManagerRepository cerereManagerRepository;
private final FirmaRepository firmaRepository;
private final FavoriteRepository favoriteRepository;
private final NotificareRepository notificareRepository;
private final RezervareRepository rezervareRepository;

    // ADĂUGAT ACEASTĂ VARIABILĂ PENTRU FRONTEND URI
    @Value("${app.frontEndUri}")
    private String frontEndUri;

    @Autowired
    public UserService(RezervareRepository rezervareRepository,FavoriteRepository favoriteRepository,NotificareRepository notificareRepository, PasswordEncoder passwordEncoder, FileDbService fileDbService,
            SecretGenerator twoFactorSecretGenerator, AppProperties appProperties, TokenService tokenService,
            TokenRepository tokenRepository, ResourceLoader resourceLoader, UserRepository userRepository,
            EmailService emailService, UserMapper userMapper,
            TwoFactoryRecoveryCodeRepository twoFactoryRecoveryCodeRepository, MessageService messageService,
            CerereManagerRepository cerereManagerRepository, FirmaRepository firmaRepository) { 
        this.favoriteRepository=favoriteRepository;
        this.notificareRepository=notificareRepository;
        this.rezervareRepository=rezervareRepository;
                this.passwordEncoder = passwordEncoder;
        this.fileDbService = fileDbService;
        this.twoFactorSecretGenerator = twoFactorSecretGenerator;
        this.appProperties = appProperties;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
        this.resourceLoader = resourceLoader;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.twoFactoryRecoveryCodeRepository = twoFactoryRecoveryCodeRepository;
        this.messageService = messageService;
        this.cerereManagerRepository = cerereManagerRepository; 
        this.firmaRepository = firmaRepository; 
    }

    // Înlocuiește metoda createNewUser din UserService cu aceasta:

public User createNewUser(SignUpRequestDto signUpRequestDto) throws IOException, URISyntaxException {
    if (isEmailUsed(signUpRequestDto.getEmail())) {
        log.error("Email {} is already used", signUpRequestDto.getEmail());
        throw new BadRequestException("emailInUse");
    }
    if (isUsernameUsed(signUpRequestDto.getName())) {
        log.error("Username {} is already used", signUpRequestDto.getName());
        throw new BadRequestException("usernameInUse");
    }
    
    // ✅ VALIDARE NUMĂR TELEFON PENTRU UTILIZATORI NOI
    if (signUpRequestDto.getNumarTelefon() != null && !signUpRequestDto.getNumarTelefon().trim().isEmpty()) {
        if (isPhoneNumberUsed(signUpRequestDto.getNumarTelefon())) {
            log.error("Phone number {} is already used", signUpRequestDto.getNumarTelefon());
            throw new BadRequestException("phoneNumberInUse");
        }
    }
    
    User user = new User();
    user.setEmailVerified(false);
    user.setName(signUpRequestDto.getName());
    user.setEmail(signUpRequestDto.getEmail());
    
    // ✅ SETEAZĂ NUMĂRUL DE TELEFON
    user.setNumarTelefon(signUpRequestDto.getNumarTelefon());
    
    user.setAuthProvider(AuthProvider.local);
    user.setPassword(passwordEncoder.encode(signUpRequestDto.getPassword()));
    user.setTwoFactorEnabled(false);
    user.setRole(Role.USER);
    user.setProfileImage(fileDbService.save("blank-profile-picture.png", FileType.IMAGE_PNG, 
            resourceLoader.getResource("classpath:images\\blank-profile-picture.png").getInputStream().readAllBytes()));
    
    user = userRepository.save(user);
    if(signUpRequestDto.getRole().equals("USER")){
    // Restul metodei rămâne la fel
        JwtToken jwtToken = tokenService.createToken(user,
                Duration.of(appProperties.getAuth().getVerificationTokenExpirationMsec(), ChronoUnit.MILLIS),
                TokenType.ACCOUNT_ACTIVATION);
        
        String activationUrl = String.format("%s/activate-account?token=%s&email=%s",
                frontEndUri,
                jwtToken.getValue(),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8));
        
        log.info("🔗 Generated activation URL: {}", activationUrl);
        
            emailService.sendSimpleMessage(
                signUpRequestDto.getEmail(),
                appProperties.getAppName() + " - Activează-ți contul",
                String.format("Pentru a-ți activa contul, accesează următorul link: %s", activationUrl));
    }
    return user;
}

// ✅ METODĂ NOUĂ PENTRU VERIFICAREA TELEFONULUI
public boolean isPhoneNumberUsed(String phoneNumber) {
    if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
        return false; // NULL sau empty nu se consideră folosit
    }
    return userRepository.existsByNumarTelefon(phoneNumber.trim());
}

 
    // ✅ METODĂ NOUĂ PENTRU VERIFICAREA TELEFONULUI
    // public boolean isPhoneNumberUsed(String phoneNumber) {
    //     if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
    //         return false; // NULL sau empty nu se consideră folosit
    //     }
    //     return userRepository.existsByNumarTelefon(phoneNumber.trim());
    // }

    public User updateUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Cacheable(cacheNames = "user", key = "#id")
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void cancelUserAccount(Long userId) {
        userRepository.deleteById(userId);
    }

    public User updatePassword(User user, ChangePasswordDto changePasswordDto) {
        if (passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
            return userRepository.save(user);
        } else {
            throw new UnauthorizedRequestException();
        }
    }

    // public User activateUserAccount(TokenAccessRequestDto tokenAccessRequestDto) {
    //     Optional<JwtToken> optionalVerificationToken = tokenRepository
    //             .findByValueAndTokenType(tokenAccessRequestDto.getToken(), TokenType.ACCOUNT_ACTIVATION);
    //     if (optionalVerificationToken.isPresent()) {
    //         User user = optionalVerificationToken.get().getUser();
    //         if (!tokenService.validateJwtToken(tokenAccessRequestDto.getToken())) {
    //             throw new BadRequestException("tokenExpired");
    //         } else {
    //             user.setEmailVerified(true);
    //             userRepository.save(user);
    //             tokenRepository.delete(optionalVerificationToken.get());
    //         }
    //         return userRepository.save(user);
    //     }
    //     throw new BadRequestException("invalidToken");
    // }
    public User activateUserAccount(TokenAccessRequestDto tokenAccessRequestDto) {
        log.info("🔐 Account activation attempt with token: {}", 
                tokenAccessRequestDto.getToken().substring(0, Math.min(20, tokenAccessRequestDto.getToken().length())) + "...");
        
        try {
            // Validează token-ul înainte de căutare în baza de date
            if (!tokenService.validateJwtToken(tokenAccessRequestDto.getToken())) {
                log.error("❌ Invalid or expired JWT token");
                throw new BadRequestException("tokenExpired");
            }
            
            // Extrage user ID din token
            Long userId = tokenService.getUserIdFromToken(tokenAccessRequestDto.getToken());
            log.info("👤 Extracted user ID from token: {}", userId);
            
            // Găsește utilizatorul
            User user = findById(userId).orElseThrow(() -> new BadRequestException("userNotFound"));
            log.info("🔍 Found user: {} (verified: {})", user.getEmail(), user.getEmailVerified());
            
            // ✅ VERIFICĂ DACĂ UTILIZATORUL ESTE DEJA ACTIVAT
            if (user.getEmailVerified()) {
                log.info("✅ User {} is already activated, returning success", user.getEmail());
                return user; // Returnează succes dacă deja e activat
            }
            
            // Caută token-ul în baza de date
            Optional<JwtToken> optionalVerificationToken = tokenRepository.findByValueAndTokenType(
                    tokenAccessRequestDto.getToken(), TokenType.ACCOUNT_ACTIVATION);
            
            if (optionalVerificationToken.isEmpty()) {
                log.error("❌ Activation token not found in database");
                throw new BadRequestException("invalidToken");
            }
            
            JwtToken verificationToken = optionalVerificationToken.get();
            log.info("🔑 Found verification token for user: {}", verificationToken.getUser().getEmail());
            
            // Verifică dacă token-ul aparține aceluiași utilizator
            if (!verificationToken.getUser().getId().equals(userId)) {
                log.error("❌ Token user mismatch: token belongs to {}, but extracted ID is {}", 
                        verificationToken.getUser().getId(), userId);
                throw new BadRequestException("invalidToken");
            }
            
            // Activează contul
            user.setEmailVerified(true);
            userRepository.save(user);
            
            // Șterge token-ul folosit
            tokenRepository.delete(verificationToken);
            
            log.info("✅ Account activated successfully for user: {}", user.getEmail());
            return user;
            
        } catch (BadRequestException e) {
            log.error("❌ Account activation failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ Unexpected error during account activation", e);
            throw new BadRequestException("activationError");
        }
    }

    public User disableTwoFactorAuthentication(User user) {
        user.setTwoFactorSecret(null);
        user.setTwoFactorEnabled(false);
        user.getTwoFactorRecoveryCodes().clear();
        return userRepository.save(user);
    }

    public User enableTwoFactorAuthentication(User user) {
        user.setTwoFactorEnabled(true);
        return userRepository.save(user);
    }

    public User activateRequestedEmail(TokenAccessRequestDto tokenAccessRequestDto) {
        Optional<JwtToken> optionalVerificationToken = tokenRepository
                .findByValueAndTokenType(tokenAccessRequestDto.getToken(), TokenType.EMAIL_UPDATE);
        if (optionalVerificationToken.isPresent()) {
            User user = optionalVerificationToken.get().getUser();
            if (!tokenService.validateJwtToken(tokenAccessRequestDto.getToken())) {
                throw new BadRequestException("tokenExpired");
            } else {
                user.setEmail(user.getRequestedNewEmail());
                user.setRequestedNewEmail(null);
                userRepository.save(user);
                tokenRepository.delete(optionalVerificationToken.get());
                return user;
            }
        }
        throw new BadRequestException("invalidToken");
    }

    public User updateProfile(Long currentUserId, UserDto newUser) throws MalformedURLException, URISyntaxException {
        User user = findById(currentUserId).orElseThrow(() -> new BadRequestException("userNotFound"));
        if (!newUser.getEmail().equals(user.getEmail()) && isEmailUsed(newUser.getEmail())) {
            throw new BadRequestException("emailInUse");
        }
        if (!newUser.getName().equals(user.getName()) && isUsernameUsed(newUser.getName())) {
            throw new BadRequestException("usernameInUse");
        }
        String newEmail = newUser.getEmail();
        String oldEmail = user.getEmail();
        if (user.getEmail() != null && !user.getEmail().equals(newUser.getEmail())) {
            JwtToken jwtToken = tokenService.createToken(user,
                    Duration.of(appProperties.getAuth().getVerificationTokenExpirationMsec(), ChronoUnit.MILLIS),
                    TokenType.EMAIL_UPDATE);
            URIBuilder uriBuilder = new URIBuilder(appProperties.getEmailChangeConfirmationUri())
                    .addParameter("token", jwtToken.getValue());
            emailService.sendSimpleMessage(
                    newEmail,
                    messageService.getMessage("confirmAccountEmailChangeEmailSubject",
                            new Object[] { appProperties.getAppName() }),
                    messageService.getMessage("confirmAccountEmailChangeEmailBody",
                            new Object[] { oldEmail, newEmail, uriBuilder.build().toURL().toString() }));
        }
        return userRepository.save(userMapper.toEntity(currentUserId, newUser));
    }

    public User setNewTwoFactorSecret(User user) {
        user.setTwoFactorSecret(twoFactorSecretGenerator.generate());
        userRepository.save(user);
        return userRepository.save(user);
    }

    // METODA ACTUALIZATĂ PENTRU RESETARE PAROLĂ
    public void requestPasswordReset(User user) throws MalformedURLException, URISyntaxException {
        log.info("🔄 Starting password reset process for user: {}", user.getEmail());

        // Șterge token-ul existent dacă există
        Optional<JwtToken> forgottenPasswordToken = tokenRepository.findByUserAndTokenType(user,
                TokenType.FORGOTTEN_PASSWORD);
        if (forgottenPasswordToken.isPresent()) {
            log.info("🗑️ Deleting existing password reset token for user: {}", user.getName());
            tokenService.delete(forgottenPasswordToken.get());
        }

        // Creează token nou
        JwtToken jwtToken = tokenService.createToken(user,
                Duration.of(appProperties.getAuth().getVerificationTokenExpirationMsec(), ChronoUnit.MILLIS),
                TokenType.FORGOTTEN_PASSWORD);
        log.info("🔑 Created new password reset token for user: {}", user.getEmail());

        // Construiește URL-ul pentru frontend cu parametrii corecți
        String resetUrl = String.format("%s/reset-password?token=%s&email=%s",
                frontEndUri,
                jwtToken.getValue(),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8));

        log.info("🔗 Generated reset URL: {}", resetUrl);

        // Trimite email-ul folosind EmailService
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl, user.getName());
            log.info("✅ Password reset email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void resetPassword(User user, PasswordResetRequestDto passwordResetRequestDto) {
        Optional<JwtToken> forgottenPasswordToken = tokenRepository.findByUserAndTokenType(user,
                TokenType.FORGOTTEN_PASSWORD);
        if (forgottenPasswordToken.isEmpty()
                || !forgottenPasswordToken.get().getValue().equals(passwordResetRequestDto.getToken())) {
            throw new BadRequestException("invalidToken");
        } else if (!tokenService.validateJwtToken(passwordResetRequestDto.getToken())) {
            throw new BadRequestException("tokenExpired");
        } else {
            updateUserPassword(user, passwordResetRequestDto.getPassword());
            tokenRepository.delete(forgottenPasswordToken.get());
        }
    }

    public TwoFactorSetupDto getTwoFactorSetup(User user) throws QrGenerationException {
        user = setNewTwoFactorSecret(user);
        QrData data = new QrData.Builder()
                .label(user.getEmail())
                .secret(user.getTwoFactorSecret())
                .issuer(appProperties.getAppName())
                .algorithm(HashingAlgorithm.SHA512)
                .digits(6)
                .period(30)
                .build();
        QrGenerator generator = new ZxingPngQrGenerator();
        TwoFactorSetupDto twoFactorSetupDto = new TwoFactorSetupDto();
        twoFactorSetupDto.setQrData(generator.generate(data));
        twoFactorSetupDto.setMimeType(generator.getImageMimeType());
        return twoFactorSetupDto;
    }

    public TwoFactorDto verifyTwoFactor(User user, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        RecoveryCodeGenerator recoveryCodeGenerator = new RecoveryCodeGenerator();
        if (verifier.isValidCode(user.getTwoFactorSecret(), code)) {
            user = enableTwoFactorAuthentication(user);
            TwoFactorDto twoFactorDto = new TwoFactorDto();
            User finalUser = user;
            List<TwoFactorRecoveryCode> twoFactorRecoveryCodes = Arrays.asList(recoveryCodeGenerator.generateCodes(16))
                    .stream()
                    .map(recoveryCode -> {
                        TwoFactorRecoveryCode twoFactorRecoveryCode = new TwoFactorRecoveryCode();
                        twoFactorRecoveryCode.setRecoveryCode(recoveryCode);
                        twoFactorRecoveryCode.setUser(finalUser);
                        return twoFactorRecoveryCode;
                    })
                    .collect(Collectors.toList());
            twoFactorRecoveryCodes = twoFactoryRecoveryCodeRepository.saveAll(twoFactorRecoveryCodes);
            twoFactorDto.setVerificationCodes(twoFactorRecoveryCodes.stream()
                    .map(TwoFactorRecoveryCode::getRecoveryCode).collect(Collectors.toList()));
            return twoFactorDto;
        }
        throw new BadRequestException("invalidVerificationCode");
    }

    public boolean isUsernameUsed(String username) {
        return userRepository.existsByName(username);
    }

    public boolean isEmailUsed(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Verifică dacă există un utilizator cu email-ul specificat
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Salvează un utilizator în baza de date
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Șterge un utilizator după ID
     */
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
public User createManagerRequest(SignUpManagerRequestDto dto) throws IOException, URISyntaxException {
    log.info("🏢 Creating manager request for email: {}", dto.getEmail());
    
    // PASUL 1: Validări preliminare
    if (isEmailUsed(dto.getEmail())) {
        log.error("Email {} is already used", dto.getEmail());
        throw new BadRequestException("emailInUse");
    }
    if (isUsernameUsed(dto.getName())) {
        log.error("Username {} is already used", dto.getName());
        throw new BadRequestException("usernameInUse");
    }
    if (dto.getNumarTelefon() != null && !dto.getNumarTelefon().trim().isEmpty()) {
        if (isPhoneNumberUsed(dto.getNumarTelefon())) {
            log.error("Phone number {} is already used", dto.getNumarTelefon());
            throw new BadRequestException("phoneNumberInUse");
        }
    }
    
    // Validări specifice pentru firmă
    if (cerereManagerRepository.existsByCui(dto.getCui()) || firmaRepository.existsByCui(dto.getCui())) {
        log.error("CUI {} is already used", dto.getCui());
        throw new BadRequestException("cuiInUse");
    }
    
    // PASUL 2: Creez utilizatorul ca CLIENT
    User user = new User();
    user.setEmailVerified(false);
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setNumarTelefon(dto.getNumarTelefon());
    user.setAuthProvider(AuthProvider.local);
    user.setPassword(passwordEncoder.encode(dto.getPassword()));
    user.setTwoFactorEnabled(false);
    user.setRole(Role.USER); // Începe ca CLIENT
    user.setProfileImage(fileDbService.save("blank-profile-picture.png", FileType.IMAGE_PNG, 
            resourceLoader.getResource("classpath:images\\blank-profile-picture.png").getInputStream().readAllBytes()));
    
    user = userRepository.save(user);
    log.info("✅ User created with ID: {}", user.getId());
    
    // PASUL 3: Creez automat cererea de manager
    CerereManager cerereManager = CerereManager.builder()
            .user(user)
            .localitate(dto.getLocalitateId())
            .cui(dto.getCui().toUpperCase())
            .denumire(dto.getDenumire())
            .adresa(dto.getAdresa())
            .telefon(dto.getTelefonFirma())
            .email(dto.getEmailFirma())
            .status(StatusCerere.IN_ASTEPTARE)
            .build();
    
            cerereManager = cerereManagerRepository.save(cerereManager);
    log.info("✅ Manager request created with ID: {}", cerereManager.getId());
    
    // PASUL 4: Creez token pentru activarea contului
    JwtToken jwtToken = tokenService.createToken(user,
            Duration.of(appProperties.getAuth().getVerificationTokenExpirationMsec(), ChronoUnit.MILLIS),
            TokenType.ACCOUNT_ACTIVATION);
    
    String activationUrl = String.format("%s/activate-account?token=%s&email=%s",
            frontEndUri,
            jwtToken.getValue(),
            URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8));
    
    log.info("🔗 Generated activation URL: {}", activationUrl);
    
    // PASUL 5: Trimit email de activare cu informații despre cererea de manager
    String emailBody = String.format(
        "Bună ziua %s,\n\n" +
        "Contul dumneavoastră a fost creat cu succes!\n\n" +
        "Pentru a vă activa contul, accesați următorul link: %s\n\n" +
        "De asemenea, cererea dumneavoastră pentru firma \"%s\" (CUI: %s) a fost înregistrată și va fi analizată de administratori în maxim 2-3 zile lucrătoare.\n\n" +
        "Până la aprobarea cererii, veți putea folosi platforma ca CLIENT pentru a face rezervări.\n\n" +
        "Veți primi o notificare prin email când cererea va fi procesată.\n\n" +
        "Cu stimă,\n" +
        "Echipa %s",
        user.getName(),
        activationUrl,
        dto.getDenumire(),
        dto.getCui(),
        appProperties.getAppName()
    );
    
    emailService.sendSimpleMessage(
        dto.getEmail(),
        appProperties.getAppName() + " - Activare cont + Cerere manager",
        emailBody
    );
    
    log.info("✅ Manager registration completed successfully for user: {}", user.getEmail());
    return user;
}

/**
 * Schimbă parola unui utilizator
 * @param email email-ul utilizatorului
 * @param currentPassword parola curentă
 * @param newPassword noua parolă
 * @return true dacă schimbarea a avut succes
 */
@Transactional
public boolean changePassword(String email, String currentPassword, String newPassword) {
    log.info("🔐 Attempting to change password for user: {}", email);

    try {
        Optional<User> userOpt = findByEmail(email);
        if (!userOpt.isPresent()) {
            log.warn("❌ User not found: {}", email);
            return false;
        }
        User user = userOpt.get();
        log.info("🔍 Password comparison for user: {}", email);
        log.info("🔍 Current password provided length: {}", currentPassword != null ? currentPassword.length() : "NULL");
        log.info("🔍 Stored password hash starts with: {}", 
            user.getPassword() != null ? user.getPassword().substring(0, 10) + "..." : "NULL");
        boolean currentPasswordMatches = passwordEncoder.matches(currentPassword, user.getPassword());
        log.info("🔍 Password matches result: {}", currentPasswordMatches);
        
        if (!currentPasswordMatches) {
            log.warn("❌ Invalid current password for user: {}", email);
            return false; 
        }

        log.info("✅ Current password is correct, proceeding with validation");

        validateNewPassword(newPassword, currentPassword);
        log.info("✅ New password validation passed");
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        log.info("🔐 Encoding new password...");
        
        user.setPassword(encodedNewPassword);
        userRepository.save(user);
        
        log.info("✅ Password changed successfully in database for user: {}", email);
        return true;

    } catch (IllegalArgumentException e) {
        log.warn("❌ Password validation failed for user {}: {}", email, e.getMessage());
        throw e; // Re-aruncăm pentru a ajunge la controller
    } catch (Exception e) {
        log.error("❌ Unexpected error changing password for user: {}", email, e);
        return false;
    }
}




/**
 * Validează dacă o parolă este suficient de puternică
 * @param password parola de validat
 * @return true dacă parola este puternică
 */
public boolean isPasswordStrong(String password) {
    if (password == null || password.trim().isEmpty()) {
        return false;
    }

    // Verificări de bază
    if (password.length() < 6) {
        return false;
    }

    // Verificăm dacă conține cel puțin o literă mică, una mare și o cifră
    boolean hasLowerCase = password.chars().anyMatch(Character::isLowerCase);
    boolean hasUpperCase = password.chars().anyMatch(Character::isUpperCase);
    boolean hasDigit = password.chars().anyMatch(Character::isDigit);

    return hasLowerCase && hasUpperCase && hasDigit;
}

/**
 * Validează parola nouă cu cerințe de securitate
 * @param newPassword noua parolă
 * @param currentPassword parola curentă (pentru comparație)
 */
private void validateNewPassword(String newPassword, String currentPassword) {
    log.info("🔍 Validating new password...");
    
    // Verificăm dacă parola există
    if (newPassword == null || newPassword.trim().isEmpty()) {
        throw new IllegalArgumentException("Parola nouă nu poate fi goală");
    }

    // Verificăm lungimea minimă
    if (newPassword.length() < 6) {
        throw new IllegalArgumentException("Parola nouă trebuie să aibă cel puțin 6 caractere");
    }

    // Verificăm dacă este diferită de cea curentă
    if (newPassword.equals(currentPassword)) {
        throw new IllegalArgumentException("Parola nouă trebuie să fie diferită de cea curentă");
    }

    // Verificăm puterea parolei - DOAR cerințele de bază
    if (!isPasswordStrong(newPassword)) {
        throw new IllegalArgumentException("Parola nouă trebuie să conțină cel puțin o literă mică, o literă mare și o cifră");
    }

    log.info("✅ New password validation successful");
}

/**
 * Verifică dacă parola este în lista celor comune/slabe
 * @param password parola de verificat
 * @return true dacă parola este comună
 */
private boolean isCommonPassword(String password) {
    // Lista cu parole comune (în practică, aceasta ar fi mult mai mare)
    String[] commonPasswords = {
        "password", "123456", "123456789", "qwerty", "abc123",
        "password123", "admin", "letmein", "welcome", "monkey",
        "parola", "parola123", "admin123", "test123", "user123"
    };

    String lowerPassword = password.toLowerCase();
    for (String common : commonPasswords) {
        if (lowerPassword.equals(common)) {
            return true;
        }
    }

    // Verificăm și pattern-uri simple
    if (password.matches(".*1234.*") || 
        password.matches(".*abcd.*") || 
        password.matches(".*qwer.*")) {
        return true;
    }

    return false;
}





    /**
     * Șterge complet un utilizator și toate datele asociate
     * @param userId ID-ul utilizatorului de șters
     * @throws UserNotFoundException dacă utilizatorul nu există
     * @throws DataIntegrityException dacă există probleme la ștergere
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteUserCompletely(Long userId) {
        try {
            // 1. Verifică dacă utilizatorul există
            User user = userRepository.findById(userId).get();
            // Log pentru audit
            log.info("Începerea ștergerii complete pentru utilizatorul: {} (ID: {})", user.getEmail(), userId);

            // 2. Șterge toate înregistrările asociate în ordine pentru a respecta constrainturile FK
            
            // 2.1 Șterge favorite
            int favoritesDeleted = favoriteRepository.deleteByUserId(userId);
            log.debug("Au fost șterse {} favorite pentru utilizatorul {}", favoritesDeleted, userId);

            // 2.2 Șterge notificările
            int notificationsDeleted = notificareRepository.deleteByUserId(userId);
            log.debug("Au fost șterse {} notificări pentru utilizatorul {}", notificationsDeleted, userId);

            // 2.3 Șterge token-urile JWT
            int tokensDeleted = tokenRepository.deleteByUserId(userId);
            log.debug("Au fost șterse {} token-uri JWT pentru utilizatorul {}", tokensDeleted, userId);

            // 2.4 Șterge datele de two-factor recovery
            int twoFactorDeleted = twoFactoryRecoveryCodeRepository.deleteByUserId(userId);
            log.debug("Au fost șterse {} înregistrări two-factor pentru utilizatorul {}", twoFactorDeleted, userId);

            // 2.5 Șterge cererile de manager
            int managerRequestsDeleted = cerereManagerRepository.deleteByUserId(userId);
            log.debug("Au fost șterse {} cereri de manager pentru utilizatorul {}", managerRequestsDeleted, userId);

            int rezervariSterse=rezervareRepository.deleteByUserIdAndStatusIn(userId);
            // 2.8 Opțional - șterge audit logs vechi pentru acest utilizator
            // auditLogRepository.deleteByUserIdAndCreatedDateBefore(userId, LocalDateTime.now().minusYears(1));

            // 3. În final, șterge utilizatorul
            userRepository.deleteById(userId);
            
            log.info("Utilizatorul {} (ID: {}) a fost șters complet cu succes", user.getEmail(), userId);
            
        } catch (Exception e) {
            log.error("Eroare la ștergerea utilizatorului cu ID {}: {}", userId, e.getMessage(), e);
           // throw new DataIntegrityException("Eroare la ștergerea utilizatorului: " + e.getMessage());
        }
    }

    /**
     * Verifică dacă utilizatorul poate fi șters (validări business)
     */
    public boolean canDeleteUser(Long userId) {
        // Verifică dacă utilizatorul are rezervări active care nu pot fi anulate
        long activeReservations = rezervareRepository.countActiveReservationsByUserId(userId);
        
        // Verifică dacă utilizatorul este manager și are responsabilități
        boolean isManagerWithActiveResponsibilities = cerereManagerRepository
            .existsByUserIdAndStatusAndHasActiveManagementRoles(userId);

        return activeReservations == 0 && !isManagerWithActiveResponsibilities;
    }
     /**
     * Verifică dacă utilizatorul curent este același cu cel specificat
     * Folosit pentru autorizarea în @PreAuthorize
     */
    public boolean isCurrentUser(Long userId) {
        try {
            // Obține utilizatorul autentificat din SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                log.debug("Nu există autentificare activă");
                return false;
            }

            Object principal = authentication.getPrincipal();
            log.debug("Principal type: {}", principal.getClass().getSimpleName());

            // Verifică dacă principal-ul este UserPrincipal (așa cum pare să ai în aplicație)
            if (principal instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) principal;
                Long currentUserId = userPrincipal.getId();
                log.debug("Verificare: currentUserId={}, targetUserId={}", currentUserId, userId);
                return currentUserId != null && currentUserId.equals(userId);
            }
            
            // Fallback pentru alte tipuri de principal
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                String currentUsername = userDetails.getUsername();
                
                // Găsește utilizatorul după username/email
                Optional<User> currentUser = findByEmail(currentUsername);
                if (currentUser.isPresent()) {
                    Long currentUserId = currentUser.get().getId();
                    log.debug("Verificare prin email: currentUserId={}, targetUserId={}", currentUserId, userId);
                    return currentUserId.equals(userId);
                }
            }
            
            log.debug("Nu s-a putut determina utilizatorul curent din principal: {}", principal);
            return false;
            
        } catch (Exception e) {
            log.warn("Eroare la verificarea utilizatorului curent: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obține ID-ul utilizatorului curent autentificat
     */
    public Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }

            Object principal = authentication.getPrincipal();
            
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElse(null);
                return user != null ? user.getId() : null;
            }
            
            return null;
            
        } catch (Exception e) {
            log.warn("Eroare la obținerea ID-ului utilizatorului curent: {}", e.getMessage());
            return null;
        }
    }
}