package com.example.fullstacktemplate.repository;

import java.util.List;
import java.util.Optional;
import com.example.fullstacktemplate.model.StareRezervare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StareRezervareRepository extends JpaRepository<StareRezervare, Integer> {
    // Adaugă aceste metode în StareRezervareRepository.java existent



Optional<StareRezervare> findByDenumire(String denumire);

List<StareRezervare> findByActiv(Boolean activ);

List<StareRezervare> findByOrderByDenumire();
}

