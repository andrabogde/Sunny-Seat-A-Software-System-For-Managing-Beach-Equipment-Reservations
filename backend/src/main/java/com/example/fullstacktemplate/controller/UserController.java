package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.config.security.CurrentUser;
import com.example.fullstacktemplate.config.security.UserPrincipal;
import com.example.fullstacktemplate.dto.*;
import com.example.fullstacktemplate.dto.mapper.UserMapper;
import com.example.fullstacktemplate.dto.validation.CreateUserRequestDto;
import com.example.fullstacktemplate.exception.BadRequestException;
import com.example.fullstacktemplate.model.AuthProvider;
import com.example.fullstacktemplate.model.Role;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.model.FileDb;
import com.example.fullstacktemplate.model.FileType;
import com.example.fullstacktemplate.service.PlaceDetailsService;
import com.example.fullstacktemplate.service.UserService;
import com.example.fullstacktemplate.service.MessageService;
import com.example.fullstacktemplate.service.AuthenticationService;
import com.example.fullstacktemplate.service.FileDbService;

import dev.samstevens.totp.exceptions.QrGenerationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URISyntaxException;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "false")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final MessageService messageService;
    private final AuthenticationService authenticationService;
    private final PlaceDetailsService placeDetailsService;
    private final FileDbService fileDbService;

    @Autowired
    public UserController(UserMapper userMapper, 
                         PasswordEncoder passwordEncoder,
                         UserService userService,
                         MessageService messageService,
                         AuthenticationService authenticationService,
                         PlaceDetailsService placeDetailsService,
                         FileDbService fileDbService) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.messageService = messageService;
        this.authenticationService = authenticationService;
        this.placeDetailsService = placeDetailsService;
        this.fileDbService = fileDbService;
    }

    /**
     * Obține datele utilizatorului curent (/user/me)
     */
    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        try {
            log.info("🔍 Getting current user for: {}", userPrincipal.getEmail());
            
            User user = userService.findById(userPrincipal.getId())
                    .orElseThrow(() -> new BadRequestException("userNotFound"));
                    
            log.info("👤 Found user: {} with phone: {}", user.getName(), user.getNumarTelefon());
            
            // ✅ RETURNEAZĂ DATELE ÎN FORMATUL AȘTEPTAT DE AUTHCONTEXT
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("numarTelefon", user.getNumarTelefon());
            response.put("telefon", user.getNumarTelefon()); // Pentru compatibilitate
            response.put("role", user.getRole());
            response.put("authProvider", user.getAuthProvider());
            response.put("emailVerified", user.getEmailVerified());
            response.put("twoFactorEnabled", user.getTwoFactorEnabled());
            
            // ✅ ADAUGĂ IMAGINEA DE PROFIL
            if (user.getProfileImage() != null) {
                Map<String, Object> profileImageData = new HashMap<>();
                profileImageData.put("data", user.getProfileImage().getData());
                profileImageData.put("mimeType", user.getProfileImage().getType().getMimeType());
                profileImageData.put("name", user.getProfileImage().getName());
                response.put("profileImage", profileImageData);
            }
            
            log.info("📤 Sending user data");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Error getting current user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la obținerea datelor utilizatorului"));
        }
    }

    /**
     * Obține profilul utilizatorului autentificat (GET /user/profile)
     */
    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(@CurrentUser UserPrincipal userPrincipal) {
        try {
            log.info("🔍 Getting profile for user: {}", userPrincipal.getEmail());
            
            User user = userService.findById(userPrincipal.getId())
                    .orElseThrow(() -> new BadRequestException("userNotFound"));
                    
            log.info("👤 Found user: {} with phone: {}", user.getName(), user.getNumarTelefon());
            
            // ✅ RETURNEAZĂ DATELE ÎN FORMATUL AȘTEPTAT DE AUTHCONTEXT
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("numarTelefon", user.getNumarTelefon());
            response.put("telefon", user.getNumarTelefon()); // Pentru compatibilitate
            response.put("role", user.getRole());
            response.put("authProvider", user.getAuthProvider());
            response.put("emailVerified", user.getEmailVerified());
            response.put("twoFactorEnabled", user.getTwoFactorEnabled());
            
            // ✅ ADAUGĂ IMAGINEA DE PROFIL
            if (user.getProfileImage() != null) {
                Map<String, Object> profileImageData = new HashMap<>();
                profileImageData.put("data", user.getProfileImage().getData());
                profileImageData.put("mimeType", user.getProfileImage().getType().getMimeType());
                profileImageData.put("name", user.getProfileImage().getName());
                response.put("profileImage", profileImageData);
            }
            
            log.info("📤 Sending user profile data");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Error getting user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la obținerea profilului"));
        }
    }

    /**
     * Actualizează profilul utilizatorului (PUT /user/profile)
     */
    @PutMapping("/user/profile")
    public ResponseEntity<?> updateUserProfile(@CurrentUser UserPrincipal userPrincipal, @RequestBody Map<String, Object> updateData) {
        try {
            log.info("🔄 Profile update attempt for user: {}", userPrincipal.getEmail());
            log.info("📥 Update data received: {}", updateData);
            
            // Găsește utilizatorul
            User user = userService.findById(userPrincipal.getId())
                    .orElseThrow(() -> new BadRequestException("userNotFound"));
            
            log.info("👤 Current user data - Name: {}, Phone: {}", user.getName(), user.getNumarTelefon());
            
            // Actualizează doar câmpurile permise
            boolean hasChanges = false;
            
            // Actualizează numele dacă este furnizat
            if (updateData.containsKey("name") && updateData.get("name") != null) {
                String newName = updateData.get("name").toString().trim();
                if (!newName.isEmpty() && !newName.equals(user.getName())) {
                    // Verifică dacă numele nu este deja folosit
                    if (userService.isUsernameUsed(newName)) {
                        log.error("❌ Name {} already in use", newName);
                        return ResponseEntity.badRequest()
                                .body(Map.of("success", false, "message", "Acest nume este deja folosit de alt utilizator."));
                    }
                    user.setName(newName);
                    hasChanges = true;
                    log.info("📝 Updated name to: {}", newName);
                }
            }
            
            // ✅ CORECTARE: Caută atât "numarTelefon" cât și "phone" pentru compatibilitate
            String newPhone = null;
            if (updateData.containsKey("numarTelefon") && updateData.get("numarTelefon") != null) {
                newPhone = updateData.get("numarTelefon").toString().trim();
                log.info("📱 Found numarTelefon field: {}", newPhone);
            } else if (updateData.containsKey("phone") && updateData.get("phone") != null) {
                newPhone = updateData.get("phone").toString().trim();
                log.info("📱 Found phone field: {}", newPhone);
            }
            
            // Actualizează telefonul dacă a fost furnizat
            if (newPhone != null) {
                String currentPhone = user.getNumarTelefon();
                log.info("📱 Phone comparison - Current: '{}', New: '{}'", currentPhone, newPhone);
                
                if (!newPhone.equals(currentPhone)) {
                    // Verifică dacă telefonul nu este deja folosit (dacă nu este gol)
                    if (!newPhone.isEmpty() && userService.isPhoneNumberUsed(newPhone)) {
                        log.error("❌ Phone number {} already in use", newPhone);
                        return ResponseEntity.badRequest()
                                .body(Map.of("success", false, "message", "Acest număr de telefon este deja folosit de alt utilizator."));
                    }
                    user.setNumarTelefon(newPhone.isEmpty() ? null : newPhone);
                    hasChanges = true;
                    log.info("📱 Updated phone to: {}", user.getNumarTelefon());
                }
            }
            
            // Salvează doar dacă au fost modificări
            if (hasChanges) {
                user = userService.save(user);
                log.info("✅ Profile updated successfully for user: {}", userPrincipal.getEmail());
            } else {
                log.info("ℹ️ No changes detected for user: {}", userPrincipal.getEmail());
            }
            
            // ✅ RETURNEAZĂ RĂSPUNSUL ÎN FORMATUL AȘTEPTAT DE FRONTEND
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profil actualizat cu succes!");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("telefon", user.getNumarTelefon()); // Pentru compatibilitate cu frontend
            response.put("numarTelefon", user.getNumarTelefon()); // Câmpul principal
            response.put("role", user.getRole());
            response.put("authProvider", user.getAuthProvider());
            response.put("emailVerified", user.getEmailVerified());
            response.put("twoFactorEnabled", user.getTwoFactorEnabled());
            
            log.info("📤 Sending response: {}", response);
            
            return ResponseEntity.ok(response);
            
        } catch (BadRequestException e) {
            log.error("❌ Profile update failed: {}", e.getMessage());
            
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
            
        } catch (Exception e) {
            log.error("❌ Unexpected error during profile update", e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "A apărut o eroare neașteptată la actualizarea profilului."));
        }
    }

    /**
     * Upload poza de profil (POST /user/profile-image)
     */
    @PostMapping("/user/profile-image")
    public ResponseEntity<?> uploadProfileImage(@CurrentUser UserPrincipal userPrincipal, 
                                               @RequestParam("file") MultipartFile file) {
        try {
            log.info("📸 Profile image upload attempt for user: {}", userPrincipal.getEmail());
            log.info("📁 File details: name={}, size={}, type={}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());
            
            // Validări pentru fișier
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Fișierul nu poate fi gol"));
            }
            
            // Verifică dimensiunea (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Fișierul este prea mare. Maximum 5MB."));
            }
            
            // Verifică tipul fișierului
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Doar imagini sunt permise (JPG, PNG, GIF)."));
            }
            
            // Găsește utilizatorul
            User user = userService.findById(userPrincipal.getId())
                    .orElseThrow(() -> new BadRequestException("userNotFound"));
            
            // Determină tipul fișierului
            FileType fileType;
            switch (contentType.toLowerCase()) {
                case "image/jpeg":
                case "image/jpg":
                    fileType = FileType.IMAGE_JPEG;
                    break;
                case "image/png":
                    fileType = FileType.IMAGE_PNG;
                    break;
                
                default:
                    return ResponseEntity.badRequest()
                            .body(Map.of("success", false, "message", "Tip de imagine nesuportat: " + contentType));
            }
            
            // Salvează fișierul în baza de date
            FileDb profileImage = fileDbService.save(
                    file.getOriginalFilename(), 
                    fileType, 
                    file.getBytes()
            );
            
            // Actualizează utilizatorul cu noua imagine
            user.setProfileImage(profileImage);
            user = userService.save(user);
            
            log.info("✅ Profile image uploaded successfully for user: {}", userPrincipal.getEmail());
            
            // Preparăm răspunsul cu datele imaginii
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Poza de profil a fost actualizată cu succes!");
            
            Map<String, Object> profileImageData = new HashMap<>();
            profileImageData.put("data", profileImage.getData());
            profileImageData.put("mimeType", profileImage.getType().getMimeType());
            profileImageData.put("name", profileImage.getName());
            response.put("profileImage", profileImageData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Error uploading profile image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Eroare la încărcarea imaginii"));
        }
    }

    @GetMapping("/test")
    public Map<String, Object> getPlaceDetails() {
        return placeDetailsService.getPlaceDetails("Mystic Beach City");
    }

    @PostMapping("/cancel-account")
    public ResponseEntity<?> cancelAccount(@CurrentUser UserPrincipal userPrincipal) {
        userService.cancelUserAccount(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponseDto(true, messageService.getMessage("accountCancelled")));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@CurrentUser UserPrincipal userPrincipal, @Valid @RequestBody ChangePasswordDto changePasswordDto) {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        user = userService.updatePassword(user, changePasswordDto);
        String accessToken = authenticationService.createAccessToken(user);
        AuthResponseDto authResponseDto = new AuthResponseDto();
        authResponseDto.setTwoFactorRequired(false);
        authResponseDto.setAccessToken(accessToken);
        authResponseDto.setMessage(messageService.getMessage("passwordUpdated"));
        return ResponseEntity.ok(authResponseDto);
    }

    @PutMapping("/disable-two-factor")
    public ResponseEntity<?> disableTwoFactor(@CurrentUser UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        userService.disableTwoFactorAuthentication(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/two-factor-setup")
    public TwoFactorSetupDto getTwoFactorSetup(@CurrentUser UserPrincipal userPrincipal) throws QrGenerationException {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        return userService.getTwoFactorSetup(user);
    }

    @PostMapping("/verify-two-factor")
    public TwoFactorDto verifyTwoFactor(@CurrentUser UserPrincipal userPrincipal, @Valid @RequestBody TwoFactorVerificationRequestDto twoFactorVerificationRequestDto) {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        return userService.verifyTwoFactor(user, twoFactorVerificationRequestDto.getCode());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CurrentUser UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId()).orElseThrow(() -> new BadRequestException("userNotFound"));
        authenticationService.logout(user);
        return ResponseEntity.ok(new ApiResponseDto(true, messageService.getMessage("loggedOut")));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsers() {
        return userService.findAll().stream().map(userMapper::toDto).toList();
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                UserDto userDto = userMapper.toDto(user.get());
                return ResponseEntity.ok(userDto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching user by id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Creează un utilizator nou (doar pentru ADMIN) - folosind UserDto existent
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequestDto createUserDto) {
        try {
            // Verifică dacă email-ul există deja
            if (userService.existsByEmail(createUserDto.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email-ul este deja folosit de alt utilizator"));
            }

            // Creează utilizatorul nou manual
            User newUser = new User();
            newUser.setName(createUserDto.getName());
            newUser.setEmail(createUserDto.getEmail());
            newUser.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
            newUser.setRole(createUserDto.getRole());
            newUser.setAuthProvider(AuthProvider.local);
            newUser.setEmailVerified(createUserDto.getEmailVerified() != null ? createUserDto.getEmailVerified() : false);
            newUser.setTwoFactorEnabled(createUserDto.getTwoFactorEnabled() != null ? createUserDto.getTwoFactorEnabled() : false);

            User savedUser = userService.save(newUser);
            UserDto responseDto = userMapper.toDto(savedUser);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Eroare la crearea utilizatorului: " + e.getMessage()));
        }
    }

    /**
     * Actualizează un utilizator existent (doar pentru ADMIN) - folosind UserDto existent
     */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        try {
            Optional<User> userOptional = userService.findById(id);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Verifică dacă email-ul nou este deja folosit de alt utilizator
            if (userDto.getEmail() != null && 
                !userDto.getEmail().equals(userOptional.get().getEmail()) && 
                userService.existsByEmail(userDto.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email-ul este deja folosit de alt utilizator"));
            }

            // Folosește UserMapper pentru actualizare
            User updatedUser = userMapper.toEntity(id, userDto);
            
            // Păstrează parola existentă (UserDto nu conține parola)
            updatedUser.setPassword(userOptional.get().getPassword());
            
            User savedUser = userService.save(updatedUser);
            UserDto responseDto = userMapper.toDto(savedUser);

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("Error updating user with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Eroare la actualizarea utilizatorului: " + e.getMessage()));
        }
    }

    /**
     * Șterge un utilizator (doar pentru ADMIN)
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.isCurrentUser(#id)")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        try {
            // Previne ștergerea propriului cont
            // if (id.equals(currentUser.getId())) {
            //     return ResponseEntity.badRequest()
            //             .body(Map.of("error", "Nu poți să îți ștergi propriul cont"));
            // }

            Optional<User> userOptional = userService.findById(id);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User userToDelete = userOptional.get();
            
            // Previne ștergerea altor administratori
            if (userToDelete.getRole() == Role.ADMIN) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Nu poți șterge alt administrator"));
            }

            userService.deleteUserCompletely(id);
            
            return ResponseEntity.ok(Map.of("message", "Utilizator șters cu succes"));
        } catch (Exception e) {
            log.error("Error deleting user with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Eroare la ștergerea utilizatorului: " + e.getMessage()));
        }
    }

    /**
     * Toggle email verification pentru un utilizator (doar pentru ADMIN)
     */
    @PatchMapping("/users/{id}/email-verification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleEmailVerification(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.findById(id);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            user.setEmailVerified(!user.getEmailVerified());
            User savedUser = userService.save(user);
            UserDto responseDto = userMapper.toDto(savedUser);

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("Error toggling email verification for user id: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Eroare la schimbarea verificării email: " + e.getMessage()));
        }
    }
}