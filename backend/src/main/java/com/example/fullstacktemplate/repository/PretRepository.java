package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.EchipamentPlaja;
import com.example.fullstacktemplate.model.Pret;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PretRepository extends JpaRepository<Pret, Integer> {
     // Prețul curent pentru un echipament de plajă (cel mai recent)
// @Query("SELECT p FROM Pret p WHERE p.echipamentPlajaId = :echipamentPlajaId ORDER BY p.dataOra DESC")
// List<Pret> findLatestPretByEchipamentPlajaId(@Param("echipamentPlajaId") Integer echipamentPlajaId, Pageable pageable);

Optional<Pret> findTopByEchipamentPlajaIdOrderByDataOraDesc(Integer echipamentPlajaId);
List<Pret> findByEchipamentPlajaIdOrderByDataOraDesc(Integer echipamentPlajaId);
// Optional<Pret> findTopByEchipamentPlajaOrderByDataOraDesc(EchipamentPlaja echipamentPlaja);


}

