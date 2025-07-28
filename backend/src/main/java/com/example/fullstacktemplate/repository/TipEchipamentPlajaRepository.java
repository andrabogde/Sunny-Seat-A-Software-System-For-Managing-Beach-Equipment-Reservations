package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipEchipamentPlajaRepository extends JpaRepository<TipEchipamentPlaja, Integer> {

    // 🔧 METODELE NECESARE PENTRU VALIDATOR
    
    /**
     * Verifică dacă există un tip de echipament cu o anumită denumire (case insensitive)
     */
    boolean existsByDenumireIgnoreCase(String denumire);
    
    /**
     * Găsește tipul de echipament după denumire exactă (case insensitive)
     */
    Optional<TipEchipamentPlaja> findByDenumireIgnoreCase(String denumire);
    
    // 🔧 OPȚIONAL: Alte metode utile
    
    /**
     * Verifică dacă există un tip de echipament cu o anumită denumire (case sensitive)
     */
    boolean existsByDenumire(String denumire);
}