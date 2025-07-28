package com.example.fullstacktemplate.repository;


import com.example.fullstacktemplate.model.Localitate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalitateRepository extends JpaRepository<Localitate, Integer> {
    List<Localitate> findByTaraId(Integer taraId);
}

