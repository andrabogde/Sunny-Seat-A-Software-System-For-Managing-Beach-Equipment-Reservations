package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.NotificareDTO;
import com.example.fullstacktemplate.service.NotificareService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificari")
@CrossOrigin(origins = "*")
public class NotificareController {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificareController.class);
    
    @Autowired
    private NotificareService notificareService;
    
    /**
     * 🔧 DEBUGGING COMPLET: Obține notificările utilizatorului cu paginare
     */
    @GetMapping
    public ResponseEntity<?> getNotificari(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // 🔍 DEBUGGING COMPLET
        logger.info("🔍 === NOTIFICARI ENDPOINT APELAT ===");
        
        try {
            // 1. Verifică Authentication
            logger.info("🔍 Authentication object: {}", authentication);
            
            if (authentication == null) {
                logger.error("❌ Authentication este NULL!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Authentication este NULL"));
            }
            
            logger.info("🔍 Authentication.getName(): {}", authentication.getName());
            logger.info("🔍 Authentication.isAuthenticated(): {}", authentication.isAuthenticated());
            logger.info("🔍 Authentication.getClass(): {}", authentication.getClass().getSimpleName());
            logger.info("🔍 Authentication.getAuthorities(): {}", authentication.getAuthorities());
            logger.info("🔍 Page: {}, Size: {}", page, size);
            
            // 2. Extrage utilizator ID
            Long utilizatorId;
            try {
                utilizatorId = getUserIdFromAuth(authentication);
                logger.info("🔍 UtilizatorId extras cu succes: {}", utilizatorId);
            } catch (Exception e) {
                logger.error("❌ Eroare la extragerea utilizatorId din authentication", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Nu s-a putut extrage utilizator ID: " + e.getMessage()));
            }
            
            // 3. Apelează service-ul
            Page<NotificareDTO> notificari;
            try {
                logger.info("🔍 Apelarez notificareService.getNotificariUtilizator...");
                notificari = notificareService.getNotificariUtilizator(utilizatorId, page, size);
                logger.info("✅ Service apelat cu succes. Total găsite: {}", notificari.getTotalElements());
            } catch (Exception e) {
                logger.error("❌ Eroare în notificareService.getNotificariUtilizator", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("Eroare la încărcarea notificărilor: " + e.getMessage()));
            }
            
            // 4. Debug conținut
            logger.info("📋 Notificari găsite: {}", notificari.getTotalElements());
            notificari.getContent().forEach(notif -> 
                logger.info("📋 Notificare {}: {}", notif.getId(), 
                           notif.getContinut().substring(0, Math.min(100, notif.getContinut().length())))
            );
            
            // 5. Construiește răspunsul în formatul așteptat de frontend
            Map<String, Object> response = new HashMap<>();
            response.put("content", notificari.getContent());
            response.put("totalElements", notificari.getTotalElements());
            response.put("totalPages", notificari.getTotalPages());
            response.put("number", notificari.getNumber());
            response.put("size", notificari.getSize());
            response.put("first", notificari.isFirst());
            response.put("last", notificari.isLast());
            
            logger.info("✅ Returnez răspuns cu {} notificări pentru utilizatorul {}", 
                       notificari.getContent().size(), utilizatorId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Eroare neașteptată în getNotificari", e);
            logger.error("❌ Stack trace complet:", e);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Eroare internă: " + e.getClass().getSimpleName() + " - " + e.getMessage()));
        }
    }
    
    /**
     * 🆕 ENDPOINT DE TEST pentru verificarea conectivității
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testNotificari(Authentication authentication) {
        logger.info("🔍 TEST ENDPOINT APELAT");
        
        Map<String, Object> testResponse = new HashMap<>();
        testResponse.put("status", "OK");
        testResponse.put("message", "Notificari API funcționează!");
        testResponse.put("timestamp", System.currentTimeMillis());
        
        // Test authentication
        if (authentication != null) {
            testResponse.put("authenticated", true);
            testResponse.put("username", authentication.getName());
            testResponse.put("authorities", authentication.getAuthorities());
            
            try {
                Long userId = getUserIdFromAuth(authentication);
                testResponse.put("userId", userId);
            } catch (Exception e) {
                testResponse.put("userIdError", e.getMessage());
            }
        } else {
            testResponse.put("authenticated", false);
        }
        
        return ResponseEntity.ok(testResponse);
    }
    
    /**
     * 🆕 ENDPOINT SIMPLU pentru testarea service-ului
     */
    @GetMapping("/test-service")
    public ResponseEntity<Map<String, Object>> testService(Authentication authentication) {
        logger.info("🔍 TEST SERVICE ENDPOINT APELAT");
        
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Nu ești autentificat"));
            }
            
            Long userId = getUserIdFromAuth(authentication);
            
            // Test doar cu 1 element
            Page<NotificareDTO> result = notificareService.getNotificariUtilizator(userId, 0, 1);
            
            Map<String, Object> response = new HashMap<>();
            response.put("serviceWorking", true);
            response.put("userId", userId);
            response.put("totalNotifications", result.getTotalElements());
            response.put("message", "Service funcționează!");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Eroare în test service", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Service error: " + e.getMessage()));
        }
    }
    
    /**
     * Obține ultimele notificări ale utilizatorului
     */
    @GetMapping("/recente")
    public ResponseEntity<?> getNotificariRecente(Authentication authentication) {
        try {
            logger.info("📋 Cerere pentru notificări recente");
            
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Nu ești autentificat"));
            }
            
            Long utilizatorId = getUserIdFromAuth(authentication);
            List<NotificareDTO> notificari = notificareService.getUltimeleNotificari(utilizatorId);
            
            logger.info("📋 Returnate {} notificări recente pentru utilizatorul {}", 
                       notificari.size(), utilizatorId);
            
            return ResponseEntity.ok(notificari);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la obținerea notificărilor recente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Eroare la încărcarea notificărilor recente: " + e.getMessage()));
        }
    }
    
    /**
     * Șterge o notificare
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotificare(
            @PathVariable Long id,
            Authentication authentication) {
        
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Nu ești autentificat"));
            }
            
            Long utilizatorId = getUserIdFromAuth(authentication);
            notificareService.deleteNotificare(id, utilizatorId);
            
            return ResponseEntity.ok(Map.of("message", "Notificare ștearsă"));
            
        } catch (Exception e) {
            logger.error("❌ Eroare la ștergerea notificării", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la ștergerea notificării: " + e.getMessage()));
        }
    }
    
    /**
     * Șterge notificările selectate
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<Map<String, String>> deleteNotificari(
            @RequestBody List<Long> notificareIds,
            Authentication authentication) {
        
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Nu ești autentificat"));
            }
            
            Long utilizatorId = getUserIdFromAuth(authentication);
            notificareService.deleteNotificari(notificareIds, utilizatorId);
            
            return ResponseEntity.ok(Map.of("message", 
                String.format("%d notificări au fost șterse", notificareIds.size())));
            
        } catch (Exception e) {
            logger.error("❌ Eroare la ștergerea notificărilor", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la ștergerea notificărilor: " + e.getMessage()));
        }
    }
    
    /**
     * 🔧 METODĂ ÎMBUNĂTĂȚITĂ: Extrage user ID din autentificare
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        try {
            logger.info("🔍 Încerc să extrag userId din authentication...");
            logger.info("🔍 Authentication name: {}", authentication.getName());
            logger.info("🔍 Authentication principal: {}", authentication.getPrincipal());
            logger.info("🔍 Authentication principal class: {}", authentication.getPrincipal().getClass());
            
            // Încercări multiple de extragere
            String name = authentication.getName();
            
            // Încercare 1: Direct parsing la Long
            try {
                Long userId = Long.parseLong(name);
                logger.info("✅ UserId extras direct din name: {}", userId);
                return userId;
            } catch (NumberFormatException e) {
                logger.info("🔍 Name nu este număr, încerc alte metode...");
            }
            
            // Încercare 2: Verifică dacă principal este UserDetails
            Object principal = authentication.getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                org.springframework.security.core.userdetails.UserDetails userDetails = 
                    (org.springframework.security.core.userdetails.UserDetails) principal;
                try {
                    Long userId = Long.parseLong(userDetails.getUsername());
                    logger.info("✅ UserId extras din UserDetails.username: {}", userId);
                    return userId;
                } catch (NumberFormatException e) {
                    logger.info("🔍 UserDetails.username nu este număr: {}", userDetails.getUsername());
                }
            }
            
            // Încercare 3: Verifică dacă este un custom principal cu metoda getId()
            try {
                // Încearcă să acceseze prin reflecție metoda getId() din principal
                Object userIdObj = principal.getClass().getMethod("getId").invoke(principal);
                if (userIdObj != null) {
                    Long userId = Long.valueOf(userIdObj.toString());
                    logger.info("✅ UserId extras din principal.getId(): {}", userId);
                    return userId;
                }
            } catch (Exception e) {
                logger.info("🔍 Principal nu are metoda getId(): {}", e.getMessage());
            }
            
            // Încercare 4: Verifică dacă principal este String și poate fi parsat
            if (principal instanceof String) {
                try {
                    Long userId = Long.parseLong((String) principal);
                    logger.info("✅ UserId extras din principal String: {}", userId);
                    return userId;
                } catch (NumberFormatException e) {
                    logger.info("🔍 Principal String nu este număr: {}", principal);
                }
            }
            
            // Fallback: returnează 1L pentru testing
            logger.warn("⚠️ Nu s-a putut extrage userId din orice metodă, folosesc 1L pentru testing");
            logger.warn("⚠️ Pentru producție, configurează autentificarea să returneze userId corect");
            return 1L;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la extragerea userId", e);
            throw new RuntimeException("Nu s-a putut extrage utilizator ID: " + e.getMessage());
        }
    }
    
    /**
     * Helper pentru crearea răspunsurilor de eroare
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", true);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        return error;
    }
}