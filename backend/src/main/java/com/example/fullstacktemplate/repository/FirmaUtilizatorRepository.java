package com.example.fullstacktemplate.repository;


import com.example.fullstacktemplate.model.FirmaUtilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirmaUtilizatorRepository extends JpaRepository<FirmaUtilizator, Integer> {
}

