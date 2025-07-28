package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.CerereManagerDto;
import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.service.CerereManagerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",  // Vite
    "http://localhost:3000",  // React standard
    "http://localhost:4000"   // Al tău
})
@Slf4j
public class CerereManagerController {

    private final CerereManagerService cerereManagerService;

    public CerereManagerController(CerereManagerService cerereManagerService) {
        this.cerereManagerService = cerereManagerService;
    }

    // ========================================
    // 🔴 ENDPOINT-URI ADMIN (ceea ce caută frontend-ul)
    // ========================================

    /**
     * 📋 ENDPOINT PRINCIPAL PENTRU ADMIN - obține toate cererile
     * GET /api/admin/cereri-manageri
     */
    @GetMapping("/api/admin/cereri-manageri")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCereriAdmin() {
        try {
            log.info("🔴 ADMIN endpoint called: /api/admin/cereri-manageri");
            List<CerereManager> cereri = cerereManagerService.getAllCereri();
            log.info("✅ Found {} manager requests for admin", cereri.size());
            
            // ✅ IMPORTANT: Returnează liste mici pentru debugging
            if (cereri.size() > 100) {
                log.warn("⚠️ Large dataset detected ({}), limiting to first 100 for admin interface", cereri.size());
                cereri = cereri.subList(0, 100);
            }
            
            return ResponseEntity.ok(cereri);
        } catch (Exception e) {
            log.error("❌ Error in admin endpoint getting manager requests", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare la obținerea cererilor: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Adaugă această metodă în CerereManagerController.java:

/**
 * 🚑 QUICK FIX - endpoint simplificat fără relații complexe
 */
@GetMapping("/api/admin/cereri-manageri/simple")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getAllCereriSimple() {
    try {
        log.info("🚑 SIMPLE endpoint called: /api/admin/cereri-manageri/simple");
        
        // Obține doar entitățile de bază, fără relații
        List<CerereManager> cereri = cerereManagerService.getAllCereriSimple();
        
        // Convertește la DTO-uri simple pentru a evita circular references
        List<Map<String, Object>> simpleCereri = cereri.stream().map(cerere -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", cerere.getId());
            dto.put("cui", cerere.getCui());
            dto.put("denumire", cerere.getDenumire());
            dto.put("email", cerere.getEmail());
            dto.put("telefon", cerere.getTelefon());
            dto.put("adresa", cerere.getAdresa());
            dto.put("localitate", cerere.getLocalitate());
            dto.put("status", cerere.getStatus());
            dto.put("createdAt", cerere.getCreatedAt());
            dto.put("motivRespingere", cerere.getMotivRespingere());
            
            // User data simplu, fără relații
            if (cerere.getUser() != null) {
                Map<String, Object> userDto = new HashMap<>();
                userDto.put("id", cerere.getUser().getId());
                userDto.put("name", cerere.getUser().getName());
                userDto.put("email", cerere.getUser().getEmail());
                dto.put("user", userDto);
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        log.info("✅ Returning {} simplified requests", simpleCereri.size());
        return ResponseEntity.ok(simpleCereri);
        
    } catch (Exception e) {
        log.error("❌ Error in simple endpoint", e);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Eroare la obținerea cererilor: " + e.getMessage());
        
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}

    /**
     * ✅ APROBĂ CERERE - ADMIN ENDPOINT
     * PUT /api/admin/cereri-manageri/{id}/aproba
     */
    @PutMapping("/api/admin/cereri-manageri/{id}/aproba")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> aprobaCerereAdmin(@PathVariable Long id) {
        try {
            log.info("✅ ADMIN approving manager request: {}", id);
            
            cerereManagerService.aprobaCerere(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cererea a fost aprobată cu succes! Utilizatorul este acum manager.");
            
            log.info("✅ Admin approved manager request {} successfully", id);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("❌ Admin error approving request {}: {}", id, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("❌ Admin unexpected error approving request: {}", id, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare neașteptată la aprobarea cererii");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * ❌ RESPINGE CERERE - ADMIN ENDPOINT
     * PUT /api/admin/cereri-manageri/{id}/respinge
     */
    @PutMapping("/api/admin/cereri-manageri/{id}/respinge")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> respingeCerereAdmin(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String motiv = body.get("motiv");
            
            if (motiv == null || motiv.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Motivul respingerii este obligatoriu");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            log.info("❌ ADMIN rejecting manager request: {} with reason: {}", id, motiv);
            
            cerereManagerService.respingeCerere(id, motiv);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cererea a fost respinsă.");
            
            log.info("✅ Admin rejected manager request {} successfully", id);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("❌ Admin error rejecting request {}: {}", id, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("❌ Admin unexpected error rejecting request: {}", id, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare neașteptată la respingerea cererii");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * 📊 STATISTICI ADMIN
     * GET /api/admin/cereri-manageri/stats
     */
    @GetMapping("/api/admin/cereri-manageri/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStatisticiAdmin() {
        try {
            log.info("📊 ADMIN getting manager requests statistics");
            Map<String, Object> stats = cerereManagerService.getStatistici();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Admin error getting statistics", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare la obținerea statisticilor");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // ========================================
    // 🟢 ENDPOINT-URI PUBLICE/UTILIZATORI (endpoint-urile originale)
    // ========================================

    /**
     * Returnează toate cererile de manageri (endpoint original)
     * ⚠️ ATENȚIE: Acest endpoint generează JSON de 9MB!
     */
    @GetMapping("/api/cereri-manageri")
    public ResponseEntity<List<CerereManager>> getAllCereri() {
        try {
            log.info("📋 Getting all manager requests (public endpoint)");
            List<CerereManager> cereri = cerereManagerService.getAllCereri();
            
            // ✅ PROTECȚIE: Limitează răspunsul pentru endpoint-ul public
            if (cereri.size() > 50) {
                log.warn("⚠️ Large dataset detected ({}), limiting to first 50 for public endpoint", cereri.size());
                cereri = cereri.subList(0, 50);
            }
            
            log.info("✅ Found {} manager requests (limited)", cereri.size());
            return ResponseEntity.ok(cereri);
        } catch (Exception e) {
            log.error("❌ Error getting manager requests", e);
            throw e;
        }
    }

    /**
     * Returnează doar cererile în așteptare
     */
    @GetMapping("/api/cereri-manageri/in-asteptare")
    public ResponseEntity<List<CerereManager>> getCereriInAsteptare() {
        try {
            log.info("⏳ Getting pending manager requests");
            List<CerereManager> cereri = cerereManagerService.getAllInAsteptare();
            log.info("✅ Found {} pending requests", cereri.size());
            return ResponseEntity.ok(cereri);
        } catch (Exception e) {
            log.error("❌ Error getting pending requests", e);
            throw e;
        }
    }

    /**
     * Creează o nouă cerere de manager
     */
    @PostMapping("/api/cereri-manageri")
    public ResponseEntity<?> createCerere(@Valid @RequestBody CerereManagerDto cerereDto) {
        try {
            log.info("🏢 Creating new manager request for user: {}", cerereDto.getUserId());
            log.info("📋 Company details: CUI={}, Name={}", cerereDto.getCui(), cerereDto.getDenumire());
            
            CerereManager cerere = cerereManagerService.create(cerereDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cererea de manager a fost înregistrată cu succes!");
            response.put("cerere", cerere);
            
            log.info("✅ Manager request created successfully with ID: {}", cerere.getId());
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("❌ Error creating manager request: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("❌ Unexpected error creating manager request", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare neașteptată la crearea cererii");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Aprobă o cerere de manager (endpoint original)
     */
    @PutMapping("/api/cereri-manageri/{id}/aproba")
    public ResponseEntity<?> aprobaCerere(@PathVariable Long id) {
        try {
            log.info("✅ Approving manager request: {}", id);
            
            cerereManagerService.aprobaCerere(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cererea a fost aprobată cu succes! Utilizatorul este acum manager.");
            
            log.info("✅ Manager request {} approved successfully", id);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("❌ Error approving request {}: {}", id, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("❌ Unexpected error approving request: {}", id, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare neașteptată la aprobarea cererii");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Respinge o cerere de manager (endpoint original)
     */
    @PutMapping("/api/cereri-manageri/{id}/respinge")
    public ResponseEntity<?> respingeCerere(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String motiv = body.get("motiv");
            log.info("❌ Rejecting manager request: {} with reason: {}", id, motiv);
            
            cerereManagerService.respingeCerere(id, motiv);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cererea a fost respinsă.");
            
            log.info("✅ Manager request {} rejected successfully", id);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("❌ Error rejecting request {}: {}", id, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("❌ Unexpected error rejecting request: {}", id, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Eroare neașteptată la respingerea cererii");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Găsește cererea după ID
     */
    @GetMapping("/api/cereri-manageri/{id}")
    public ResponseEntity<CerereManager> getCerereById(@PathVariable Long id) {
        try {
            log.info("🔍 Getting manager request: {}", id);
            CerereManager cerere = cerereManagerService.getCerereById(id);
            return ResponseEntity.ok(cerere);
        } catch (RuntimeException e) {
            log.error("❌ Manager request {} not found", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Verifică dacă CUI-ul este disponibil
     */
    @GetMapping("/api/cereri-manageri/verifica-cui/{cui}")
    public ResponseEntity<?> verificaCui(@PathVariable String cui) {
        try {
            log.info("🔍 Checking CUI availability: {}", cui);
            boolean disponibil = cerereManagerService.isCuiDisponibil(cui);
            
            Map<String, Object> response = new HashMap<>();
            response.put("cui", cui);
            response.put("disponibil", disponibil);
            
            log.info("✅ CUI {} availability: {}", cui, disponibil);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Error checking CUI: {}", cui, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("cui", cui);
            errorResponse.put("disponibil", false);
            errorResponse.put("error", "Eroare la verificarea CUI-ului");
            
            return ResponseEntity.ok(errorResponse); // Return 200 with error info
        }
    }

    /**
     * Statistici pentru dashboard (endpoint original)
     */
    @GetMapping("/api/cereri-manageri/statistici")
    public ResponseEntity<?> getStatistici() {
        try {
            log.info("📊 Getting manager requests statistics");
            Map<String, Object> stats = cerereManagerService.getStatistici();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Error getting statistics", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la obținerea statisticilor");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    
}