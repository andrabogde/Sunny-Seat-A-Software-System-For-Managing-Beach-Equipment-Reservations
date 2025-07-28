package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByName(String name);
    
    // ✅ ADĂUGAT: Verificare pentru numărul de telefon
    Boolean existsByNumarTelefon(String numarTelefon);
    
    Optional<User> findByNumarTelefon(String numarTelefon);

    Optional<User> findByProviderId(String id);

     @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :start AND :end")
    long countUsersCreatedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}