package com.example.fullstacktemplate.repository;
import com.example.fullstacktemplate.model.Statiune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatiuneRepository extends JpaRepository<Statiune, Integer> {
}

