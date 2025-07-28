package com.example.fullstacktemplate.repository;


import com.example.fullstacktemplate.model.Tara;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TaraRepository extends JpaRepository<Tara, Integer> {
    Optional<Tara> findByDenumire(String denumire);
    Optional<Tara> findByCodTara(String codTara);
}

