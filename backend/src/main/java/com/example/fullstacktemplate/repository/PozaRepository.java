package com.example.fullstacktemplate.repository;



import com.example.fullstacktemplate.model.Poza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PozaRepository extends JpaRepository<Poza, Integer> {

    // Metodă personalizată pentru a găsi toate pozele pentru o anumită plajă
    List<Poza> findByPlajaIdOrderByOrdineAsc(Integer plajaId);
}

