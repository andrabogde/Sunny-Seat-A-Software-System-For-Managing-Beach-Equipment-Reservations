package com.example.fullstacktemplate.repository;


import com.example.fullstacktemplate.model.StareEchipamentPlaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StareEchipamentPlajaRepository extends JpaRepository<StareEchipamentPlaja, Integer> {
}

