package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.config.security.UserPrincipal;
import com.example.fullstacktemplate.dto.*;
import com.example.fullstacktemplate.exception.BadRequestException;
import com.example.fullstacktemplate.model.JwtToken;
import com.example.fullstacktemplate.model.User;
import org.springframework.security.core.Authentication;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:4000")
public class AuthController extends Controller {

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        try {
            log.info("🔐 Login attempt for email: {}", loginRequestDto.getEmail());
            
            // Setează rememberMe la false dacă nu este specificat
            if (loginRequestDto.getRememberMe() == null) {
                loginRequestDto.setRememberMe(false);
            }
            
            // Folosește service-ul existent pentru autentificare
            AuthResponseDto response = authenticationService.login(loginRequestDto);
            
            log.info("✅ Login successful, response: {}", response);
            if (response.getUser() != null) {
                log.info("👤 User in response - ID: {}, Email: {}, Role: {}", 
                    response.getUser().getId(), 
                    response.getUser().getEmail(), 
                    response.getUser().getRole());
            } else {
                log.warn("⚠️ WARNING: User is NULL in AuthResponseDto!");
            }
            
            // // Verifică dacă este necesar 2FA
            // if (response.isTwoFactorRequired()) {
            //     log.info("🔐 2FA required for user: {}", loginRequestDto.getEmail());
            //     return ResponseEntity.ok(response);
            // }
            
            // Returnează răspunsul în formatul așteptat de frontend
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("token", response.getAccessToken());
            responseMap.put("user", response.getUser());
            
            return ResponseEntity.ok(responseMap);
            
        } catch (BadRequestException e) {
            log.error("❌ Bad request during login: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email sau parolă incorectă");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            
        } catch (Exception e) {
            log.error("❌ Error during login for email: {}", loginRequestDto.getEmail(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Eroare internă de server");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login/verify")
    public AuthResponseDto verifyLogin(@Valid @RequestBody LoginVerificationRequestDto loginVerificationRequestDto) {
        return authenticationService.loginWithVerificationCode(loginVerificationRequestDto);
    }

    @PostMapping("/login/recovery-code")
    public AuthResponseDto loginRecoveryCode(@Valid @RequestBody LoginVerificationRequestDto loginVerificationRequestDto) {
        return authenticationService.loginWithRecoveryCode(loginVerificationRequestDto);
    }

    @GetMapping("/access-token")
    public TokenResponseDto refreshAuth() {
        Optional<JwtToken> optionalRefreshToken = authenticationService.getRefreshToken();
        if (optionalRefreshToken.isPresent()) {
            Optional<User> optionalUser = userService.findById(tokenService.getUserIdFromToken(optionalRefreshToken.get().getValue()));
            if (optionalUser.isPresent() && optionalRefreshToken.get().getUser().getId().equals(optionalUser.get().getId())) {
                return new TokenResponseDto(authenticationService.createAccessToken(optionalUser.get()));
            }
        }
        throw new BadRequestException("tokenExpired");
    }

    // @PostMapping("/signup")
    // public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequestDto signUpRequestDto) throws URISyntaxException, IOException {
    //     userService.createNewUser(signUpRequestDto);
    //     return ResponseEntity.ok(new ApiResponseDto(true, messageService.getMessage("userWasRegistered")));
    // }
   @PostMapping("/signup")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequestDto signUpRequestDto) throws URISyntaxException, IOException {
    try {
        // ✅ ADAUGĂ DEBUGGING DETALIAT
        log.info("🔐 User registration attempt for email: {}", signUpRequestDto.getEmail());
        log.info("📱 Received numarTelefon: '{}'", signUpRequestDto.getNumarTelefon());
        log.info("📋 Full request data: {}", signUpRequestDto.toString());
        
        // Verifică explicit dacă numărul de telefon este null sau gol
        if (signUpRequestDto.getNumarTelefon() == null) {
            log.error("❌ numarTelefon is NULL!");
        } else if (signUpRequestDto.getNumarTelefon().trim().isEmpty()) {
            log.error("❌ numarTelefon is EMPTY!");
        } else {
            log.info("✅ numarTelefon received correctly: '{}'", signUpRequestDto.getNumarTelefon());
        }
        
        userService.createNewUser(signUpRequestDto);

        log.info("✅ User registered successfully: {}", signUpRequestDto.getEmail());
        
        // ✅ GĂSEȘTE user-ul creat pentru a-l returna în răspuns
        User createdUser = userService.findByEmail(signUpRequestDto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found after creation"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cont creat cu succes! Verifică email-ul pentru activare.");
        
        // ✅ ADAUGĂ user-ul în răspuns pentru frontend
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", createdUser.getId());
        userMap.put("email", createdUser.getEmail());
        userMap.put("name", createdUser.getName());
        userMap.put("role", createdUser.getRole().toString());
        
        response.put("user", userMap);
        
        log.info("✅ Returning user data: ID={}, Email={}, Role={}", 
            createdUser.getId(), createdUser.getEmail(), createdUser.getRole());
        
        return ResponseEntity.ok(response);
        
    } catch (BadRequestException e) {
        log.error("❌ Registration failed: {}", e.getMessage());
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        
        // Mesaje de eroare în română
        String message;
        switch (e.getMessage()) {
            case "emailInUse":
                message = "Acest email este deja folosit de alt utilizator.";
                break;
            case "usernameInUse":
                message = "Acest nume este deja folosit de alt utilizator.";
                break;
            case "phoneNumberInUse":
                message = "Acest număr de telefon este deja folosit de alt utilizator.";
                break;
            default:
                message = "Eroare la crearea contului: " + e.getMessage();
        }
        
        errorResponse.put("message", message);
        errorResponse.put("code", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        
    } catch (Exception e) {
        log.error("❌ Unexpected error during registration", e);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "A apărut o eroare neașteptată. Vă rugăm să încercați din nou.");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

/**
 * Endpoint pentru înregistrarea managerilor cu datele firmei
 */
@PostMapping("/signup-manager")
public ResponseEntity<?> registerManager(@Valid @RequestBody SignUpManagerRequestDto signUpManagerRequestDto) 
        throws URISyntaxException, IOException {
    try {
        log.info("🏢 Manager registration attempt for email: {}", signUpManagerRequestDto.getEmail());
        log.info("🏢 Company data - CUI: {}, Denumire: {}", signUpManagerRequestDto.getCui(), signUpManagerRequestDto.getDenumire());
        log.info("📋 Full request data: {}", signUpManagerRequestDto.toString());
        
        // Creez utilizatorul și cererea de manager într-o singură tranzacție
        User createdUser = userService.createManagerRequest(signUpManagerRequestDto);

        log.info("✅ Manager registered successfully: {}", signUpManagerRequestDto.getEmail());
        
        // Construiesc răspunsul de success
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contul a fost creat cu succes! Cererea pentru firma \"" + 
                    signUpManagerRequestDto.getDenumire() + "\" va fi analizată în maxim 2-3 zile lucrătoare.");
        
        // Adaug datele user-ului în răspuns
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", createdUser.getId());
        userMap.put("email", createdUser.getEmail());
        userMap.put("name", createdUser.getName());
        userMap.put("role", createdUser.getRole().toString()); // Va fi "USER" (CLIENT)
        userMap.put("numarTelefon", createdUser.getNumarTelefon());
        
        response.put("user", userMap);
        
        // Adaug informații despre cererea de manager
        Map<String, Object> cerereInfo = new HashMap<>();
        cerereInfo.put("companyName", signUpManagerRequestDto.getDenumire());
        cerereInfo.put("cui", signUpManagerRequestDto.getCui());
        cerereInfo.put("status", "IN_ASTEPTARE");
        
        response.put("managerRequest", cerereInfo);
        
        log.info("✅ Returning manager registration response: User ID={}, Company={}", 
            createdUser.getId(), signUpManagerRequestDto.getDenumire());
        
        return ResponseEntity.ok(response);
        
    } catch (BadRequestException e) {
        log.error("❌ Manager registration failed: {}", e.getMessage());
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        
        // Mesaje de eroare în română
        String message;
        switch (e.getMessage()) {
            case "emailInUse":
                message = "Acest email este deja folosit de alt utilizator.";
                break;
            case "usernameInUse":
                message = "Acest nume este deja folosit de alt utilizator.";
                break;
            case "phoneNumberInUse":
                message = "Acest număr de telefon este deja folosit de alt utilizator.";
                break;
            case "cuiInUse":
                message = "CUI-ul " + signUpManagerRequestDto.getCui() + " este deja folosit de altă firmă.";
                break;
            default:
                message = "Eroare la crearea contului de manager: " + e.getMessage();
        }
        
        errorResponse.put("message", message);
        errorResponse.put("code", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        
    } catch (Exception e) {
        log.error("❌ Unexpected error during manager registration", e);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "A apărut o eroare neașteptată la înregistrarea managerului. Vă rugăm să încercați din nou.");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

    @PostMapping("/activate-account")
    public ResponseEntity<?> activateUserAccount(@Valid @RequestBody TokenAccessRequestDto tokenAccessRequestDto) {
        userService.activateUserAccount(tokenAccessRequestDto);
        return ResponseEntity.ok(new ApiResponseDto(true, messageService.getMessage("accountActivated")));
    }

    @PostMapping("/confirm-email-change")
    public ResponseEntity<?> confirmEmailChange(@Valid @RequestBody TokenAccessRequestDto tokenAccessRequestDto) {
        userService.activateRequestedEmail(tokenAccessRequestDto);
        return ResponseEntity.ok(new ApiResponseDto(true, messageService.getMessage("emailUpdated")));
    }

    @PostMapping("/forgotten-password")
    public ResponseEntity<?> forgottenPassword(@Valid @RequestBody ForgottenPasswordRequestDto forgottenPasswordRequestDto) throws MalformedURLException, URISyntaxException {
        User user = userService.findByEmail(forgottenPasswordRequestDto.getEmail()).orElseThrow(() -> new BadRequestException("userNotFound"));
        if (user.getEmailVerified()) {
            userService.requestPasswordReset(user);
            return ResponseEntity
                    .ok(new ApiResponseDto(true, messageService.getMessage("passwordResetEmailSentMessage")));
        } else {
            throw new BadRequestException("accountNotActivated");
        }
    }

    @PostMapping("/password-reset")
    public ResponseEntity<?> passwordReset(@Valid @RequestBody PasswordResetRequestDto passwordResetRequestDto) {
        User user = userService.findByEmail(passwordResetRequestDto.getEmail()).orElseThrow(() -> new BadRequestException("userNotFound"));
        userService.resetPassword(user, passwordResetRequestDto);
        return ResponseEntity
                .ok(new ApiResponseDto(true, messageService.getMessage("passwordWasReset")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            log.info("Logout attempt");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout realizat cu succes");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during logout", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Eroare la logout");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


   // ✅ ÎNLOCUIEȘTE cu versiunea care CHIAR schimbă parola:

@PostMapping("/change-password")
public ResponseEntity<ApiResponseDto> changePassword(
        @Valid @RequestBody ChangePasswordDto changePasswordDto,
        HttpServletRequest request) {
    
    log.info("🔐 REAL change password request received!");
    
    try {
        // ✅ EXTRAGE TOKEN ȘI USER (similar cu versiunea anterioară)
        String token = extractTokenFromRequest(request);
        if (token == null) {
            log.warn("❌ No authorization token found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDto.error("Token de autentificare lipsă"));
        }
        
        // Validează token
        if (!tokenService.validateJwtToken(token)) {
            log.warn("❌ Invalid JWT token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDto.error("Token invalid"));
        }
        
        // Extrage user ID și găsește utilizatorul
        Long userId = tokenService.getUserIdFromToken(token);
        User user = userService.findById(userId).orElse(null);
        
        if (user == null) {
            log.warn("❌ User not found for ID: {}", userId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDto.error("Utilizator inexistent"));
        }
        
        log.info("✅ Authenticated user: {} (ID: {})", user.getEmail(), userId);

        // ✅ REAL: Schimbă parola în baza de date
        boolean success = userService.changePassword(
            user.getEmail(), 
            changePasswordDto.getCurrentPassword(), 
            changePasswordDto.getNewPassword()
        );

        if (success) {
            log.info("✅ REAL password change successful for user: {}", user.getEmail());
            return ResponseEntity.ok(ApiResponseDto.success("Parola a fost schimbată cu succes!"));
        } else {
            log.warn("❌ Password change failed - invalid current password for user: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseDto.fieldError("currentPassword", "Parola curentă este incorectă"));
        }

    } catch (Exception e) {
        log.error("❌ Error in real change password", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponseDto.error("Eroare: " + e.getMessage()));
    }
}
    
    /**
     * Metodă helper pentru extragerea token-ului din request - ÎMBUNĂTĂȚITĂ
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        // Încearcă să ia din Authorization header
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("🔑 Found Bearer token in Authorization header");
            return token;
        }
        
        log.debug("❌ No valid Bearer token found in request headers");
        return null;
    }
    
    /**
     * Endpoint pentru validarea puterii parolei (opțional)
     */
    @PostMapping("/validate-password")
    public ResponseEntity<ApiResponseDto> validatePassword(@RequestBody String password) {
        try {
            boolean isStrong = userService.isPasswordStrong(password);
            
            if (isStrong) {
                return ResponseEntity.ok(ApiResponseDto.success("Parola este suficient de puternică"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDto.error("Parola nu îndeplinește cerințele de securitate"));
            }
        } catch (Exception e) {
            log.error("❌ Error validating password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Eroare la validarea parolei"));
        }
    }
    


}