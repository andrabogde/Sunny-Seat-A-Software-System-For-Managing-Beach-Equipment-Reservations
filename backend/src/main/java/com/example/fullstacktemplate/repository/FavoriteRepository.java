package com.example.fullstacktemplate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.fullstacktemplate.model.Favorite;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

       // Găsește toate favoritele unui utilizator
       List<Favorite> findByUserIdOrderByDataOraAdaugareDesc(Long userId);

       // Verifică dacă o plajă este favorită de un utilizator
       boolean existsByUserIdAndPlajaId(Long userId, Integer plajaId);

       // Găsește favoritul specific pentru a-l șterge
       Optional<Favorite> findByUserIdAndPlajaId(Long userId, Integer plajaId);

       // Numără favoritele unui utilizator
       long countByUserId(Long userId);

       // Numără de câte ori o plajă a fost adăugată la favorite
       long countByPlajaId(Integer plajaId);

       // Query personalizat pentru a obține favoritele cu detalii despre plajă
       @Query("SELECT f FROM Favorite f " +
                     "JOIN FETCH f.plaja p " +
                     "LEFT JOIN FETCH p.statiune s " +
                     "WHERE f.userId = :userId " +
                     "ORDER BY f.dataOraAdaugare DESC")
       List<Favorite> findFavoritesWithPlajaDetails(@Param("userId") Long userId);

       // Șterge toate favoritele unui utilizator
       // Șterge toate favoritele pentru o plajă
       void deleteByPlajaId(Integer plajaId);

       // Top plaje favorite (cele mai populare) - FIXED: renamed 'count' to
       // 'favoriteCount'
       @Query("SELECT f.plajaId, COUNT(f.id) as favoriteCount " +
                     "FROM Favorite f " +
                     "GROUP BY f.plajaId " +
                     "ORDER BY favoriteCount DESC")
       List<Object[]> findTopFavoritePlaje();

       @Modifying
       @Query("DELETE FROM Favorite f WHERE f.userId = :userId")
       int deleteByUserId(@Param("userId") Long userId);

}