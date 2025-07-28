package com.example.fullstacktemplate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fullstacktemplate.dto.FavoriteDto;
import com.example.fullstacktemplate.model.Favorite;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.FavoriteRepository;
import com.example.fullstacktemplate.repository.PlajaRepository;
import com.example.fullstacktemplate.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private PlajaRepository plajaRepository;
    
    @Autowired
    private UserRepository userRepository; // Adaugă pentru validarea user-ului
    
    /**
     * Adaugă o plajă la favorite cu validări complete
     */
    public FavoriteDto addToFavorites(Long userId, Integer plajaId) {
        System.out.println("🚀 FavoriteService.addToFavorites - userId: " + userId + ", plajaId: " + plajaId);
        
        // Validează că user-ul există
        if (!userRepository.existsById(userId)) {
            System.err.println("❌ User cu ID-ul " + userId + " nu există");
            throw new RuntimeException("Utilizatorul cu ID-ul " + userId + " nu există");
        }
        
        // Validează că plaja există
        Optional<Plaja> plajaOpt = plajaRepository.findById(plajaId);
        if (!plajaOpt.isPresent()) {
            System.err.println("❌ Plaja cu ID-ul " + plajaId + " nu există");
            throw new RuntimeException("Plaja cu ID-ul " + plajaId + " nu există");
        }
        
        // Verifică dacă nu este deja la favorite
        if (favoriteRepository.existsByUserIdAndPlajaId(userId, plajaId)) {
            System.out.println("⚠️ Plaja " + plajaId + " este deja la favorite pentru user " + userId);
            throw new RuntimeException("Plaja este deja la favorite");
        }
        
        try {
            // Creează și salvează favoritul
            Favorite favorite = new Favorite(userId, plajaId);
            System.out.println("💾 Salvez favoritul: " + favorite);
            
            favorite = favoriteRepository.save(favorite);
            System.out.println("✅ Favorit salvat cu succes: " + favorite);
            
            // Convertește la DTO și returnează
            return convertToDto(favorite, plajaOpt.get());
            
        } catch (DataIntegrityViolationException e) {
            System.err.println("❌ DataIntegrityViolationException: " + e.getMessage());
            if (e.getMessage().contains("unique_user_plaja") || e.getMessage().contains("Duplicate entry")) {
                throw new RuntimeException("Plaja este deja la favorite");
            } else if (e.getMessage().contains("fk_favorite_user")) {
                throw new RuntimeException("Utilizatorul nu există");
            } else if (e.getMessage().contains("fk_favorite_plaja")) {
                throw new RuntimeException("Plaja nu există");
            } else {
                throw new RuntimeException("Eroare la salvarea favoratului: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("❌ Eroare neașteptată: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Eroare la adăugarea la favorite: " + e.getMessage());
        }
    }
    
    /**
     * Elimină o plajă din favorite
     */
    public void removeFromFavorites(Long userId, Integer plajaId) {
        System.out.println("🗑️ FavoriteService.removeFromFavorites - userId: " + userId + ", plajaId: " + plajaId);
        
        Optional<Favorite> favoriteOpt = favoriteRepository.findByUserIdAndPlajaId(userId, plajaId);
        if (favoriteOpt.isPresent()) {
            favoriteRepository.delete(favoriteOpt.get());
            System.out.println("✅ Favorit eliminat cu succes");
        } else {
            System.out.println("⚠️ Plaja nu era la favorite");
            throw new RuntimeException("Plaja nu este la favorite");
        }
    }
    
    /**
     * Obține toate favoritele unui utilizator
     */
    @Transactional(readOnly = true)
    public List<FavoriteDto> getUserFavorites(Long userId) {
        System.out.println("📋 FavoriteService.getUserFavorites - userId: " + userId);
        
        List<Favorite> favorites = favoriteRepository.findFavoritesWithPlajaDetails(userId);
        System.out.println("📊 Găsite " + favorites.size() + " favorite");
        
        return favorites.stream()
                .map(favorite -> convertToDto(favorite, favorite.getPlaja()))
                .collect(Collectors.toList());
    }
    
    /**
     * Verifică dacă o plajă este favorită
     */
    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Integer plajaId) {
        boolean result = favoriteRepository.existsByUserIdAndPlajaId(userId, plajaId);
        System.out.println("🔍 isFavorite - userId: " + userId + ", plajaId: " + plajaId + " -> " + result);
        return result;
    }
    
    /**
     * Obține lista de ID-uri ale plajelor favorite
     */
    @Transactional(readOnly = true)
    public List<Integer> getUserFavoriteIds(Long userId) {
        System.out.println("🆔 FavoriteService.getUserFavoriteIds - userId: " + userId);
        
        List<Integer> ids = favoriteRepository.findByUserIdOrderByDataOraAdaugareDesc(userId)
                .stream()
                .map(Favorite::getPlajaId)
                .collect(Collectors.toList());
                
        System.out.println("🆔 Găsite ID-uri favorite: " + ids);
        return ids;
    }
    
    /**
     * Numără favoritele unui utilizator
     */
    @Transactional(readOnly = true)
    public long countUserFavorites(Long userId) {
        long count = favoriteRepository.countByUserId(userId);
        System.out.println("🔢 Numărul de favorite pentru user " + userId + ": " + count);
        return count;
    }
    
    /**
     * Toggle favorite (adaugă dacă nu există, elimină dacă există)
     */
    public boolean toggleFavorite(Long userId, Integer plajaId) {
        System.out.println("🔄 FavoriteService.toggleFavorite - userId: " + userId + ", plajaId: " + plajaId);
        
        if (favoriteRepository.existsByUserIdAndPlajaId(userId, plajaId)) {
            System.out.println("➖ Elimină din favorite");
            removeFromFavorites(userId, plajaId);
            return false; // Eliminat din favorite
        } else {
            System.out.println("➕ Adaugă la favorite");
            addToFavorites(userId, plajaId);
            return true; // Adăugat la favorite
        }
    }
    
    /**
     * Obține plajele cele mai populare (cele mai des adăugate la favorite)
     */
    @Transactional(readOnly = true)
    public List<Object[]> getTopFavoritePlaje() {
        return favoriteRepository.findTopFavoritePlaje();
    }
    
    /**
     * Convertește entitatea Favorite la DTO
     */
    private FavoriteDto convertToDto(Favorite favorite, Plaja plaja) {
        FavoriteDto dto = new FavoriteDto();
        dto.setId(favorite.getId());
        dto.setUserId(favorite.getUserId());
        dto.setPlajaId(favorite.getPlajaId());
        dto.setDataOraAdaugare(favorite.getDataOraAdaugare());
        if(plaja.getDetaliiWeb().containsKey("photos")){
        List<String> photosUrls=(List<String>) plaja.getDetaliiWeb().get("photos");
            if(!photosUrls.isEmpty()){
                dto.setImagineUrl(photosUrls.get(0));
            }
        }
        
        // Adaugă datele despre plajă
        if (plaja != null) {
            dto.setNumePlaja(plaja.getDenumire());
            dto.setNumarSezlonguri(plaja.getNumarSezlonguri());
            
            if (plaja.getStatiune() != null) {
                dto.setNumeStatiune(plaja.getStatiune().getDenumire());
            }
        }
        
        return dto;
    }
}