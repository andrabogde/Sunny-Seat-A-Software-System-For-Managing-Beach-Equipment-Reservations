package com.example.fullstacktemplate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.fullstacktemplate.dto.FavoriteDto;
import com.example.fullstacktemplate.service.FavoriteService;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;
    
    /**
     * Obține toate favoritele utilizatorului curent
     */
    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getUserFavorites(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            List<FavoriteDto> favorites = favoriteService.getUserFavorites(userId);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obține lista de ID-uri ale plajelor favorite
     */
    @GetMapping("/ids")
    public ResponseEntity<List<Integer>> getUserFavoriteIds(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            List<Integer> favoriteIds = favoriteService.getUserFavoriteIds(userId);
            return ResponseEntity.ok(favoriteIds);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Verifică dacă o plajă este favorită
     */
    @GetMapping("/check/{plajaId}")
    public ResponseEntity<Map<String, Boolean>> checkIsFavorite(
            @PathVariable Integer plajaId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            boolean isFavorite = favoriteService.isFavorite(userId, plajaId);
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("isFavorite", isFavorite);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Adaugă o plajă la favorite
     */
    @PostMapping("/{plajaId}")
    public ResponseEntity<FavoriteDto> addToFavorites(
            @PathVariable Integer plajaId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            FavoriteDto favorite = favoriteService.addToFavorites(userId, plajaId);
            return ResponseEntity.ok(favorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Elimină o plajă din favorite
     */
    @DeleteMapping("/{plajaId}")
    public ResponseEntity<Map<String, String>> removeFromFavorites(
            @PathVariable Integer plajaId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            favoriteService.removeFromFavorites(userId, plajaId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Plaja a fost eliminată din favorite");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Toggle favorite (adaugă/elimină)
     */
    @PostMapping("/toggle/{plajaId}")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Integer plajaId,
            Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            boolean isNowFavorite = favoriteService.toggleFavorite(userId, plajaId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isFavorite", isNowFavorite);
            response.put("message", isNowFavorite ? "Adăugat la favorite" : "Eliminat din favorite");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obține numărul de favorite ale utilizatorului
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getFavoritesCount(Authentication authentication) {
        try {
            Long userId = getUserIdFromAuth(authentication);
            long count = favoriteService.countUserFavorites(userId);
            
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Extrage user ID din authentication cu suport pentru UserPrincipal
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        System.out.println("🔍 Extracting user ID from authentication...");
        System.out.println("🔍 Authentication: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));
        System.out.println("🔍 Is Authenticated: " + (authentication != null ? authentication.isAuthenticated() : false));
        System.out.println("🔍 Authentication Name: " + (authentication != null ? authentication.getName() : "NULL"));
        System.out.println("🔍 Principal: " + (authentication != null ? authentication.getPrincipal() : "NULL"));
        
        if (authentication == null || !authentication.isAuthenticated()) {
            System.err.println("❌ Authentication is null or not authenticated");
            throw new RuntimeException("Utilizator neautentificat");
        }
        
        Object principal = authentication.getPrincipal();
        
        // Opțiunea 1: Verifică dacă principal-ul este UserPrincipal cu reflection
        if (principal != null) {
            String principalClass = principal.getClass().getSimpleName();
            System.out.println("🔍 Principal class: " + principalClass);
            
            // Încearcă să extragi ID-ul din UserPrincipal folosind reflection
            try {
                Method getIdMethod = principal.getClass().getMethod("getId");
                Object idObject = getIdMethod.invoke(principal);
                
                if (idObject instanceof Long) {
                    Long userId = (Long) idObject;
                    System.out.println("✅ User ID extracted from UserPrincipal: " + userId);
                    return userId;
                } else if (idObject instanceof Integer) {
                    Long userId = ((Integer) idObject).longValue();
                    System.out.println("✅ User ID extracted from UserPrincipal (converted from Integer): " + userId);
                    return userId;
                } else if (idObject != null) {
                    // Încearcă să parsezi ca string
                    Long userId = Long.parseLong(idObject.toString());
                    System.out.println("✅ User ID extracted from UserPrincipal (parsed from string): " + userId);
                    return userId;
                }
            } catch (Exception e) {
                System.out.println("⚠️ Could not extract ID using reflection: " + e.getMessage());
            }
        }
        
        // Opțiunea 2: Încearcă să parsezi numele ca ID
        try {
            String name = authentication.getName();
            if (name != null && !name.isEmpty()) {
                Long userId = Long.parseLong(name);
                System.out.println("✅ User ID extracted from name: " + userId);
                return userId;
            }
        } catch (NumberFormatException e) {
            System.out.println("⚠️ Authentication name is not a number: " + authentication.getName());
        }
        
        // Opțiunea 3: Verifică dacă principal-ul este UserDetails
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) principal;
            
            System.out.println("🔍 UserDetails username: " + userDetails.getUsername());
            
            // Dacă username-ul este ID-ul
            try {
                Long userId = Long.parseLong(userDetails.getUsername());
                System.out.println("✅ User ID extracted from UserDetails: " + userId);
                return userId;
            } catch (NumberFormatException e) {
                System.out.println("⚠️ UserDetails username is not a number: " + userDetails.getUsername());
            }
        }
        
        // Dacă toate metodele eșuează
        System.err.println("❌ Could not extract user ID from authentication");
        System.err.println("❌ Principal type: " + (principal != null ? principal.getClass().getName() : "NULL"));
        System.err.println("❌ Authentication type: " + authentication.getClass().getName());
        
        throw new RuntimeException("Nu s-a putut determina ID-ul utilizatorului din authentication");
    }
}