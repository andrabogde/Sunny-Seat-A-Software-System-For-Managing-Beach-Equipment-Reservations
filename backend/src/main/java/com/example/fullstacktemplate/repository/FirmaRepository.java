package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.model.Plaja;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirmaRepository extends JpaRepository<Firma, Integer> {

    boolean existsByCui(String cui);

    boolean existsByTelefon(String telefon);

    boolean existsByEmail(String email);

    Optional<Firma> findByCui(String cui);
}
