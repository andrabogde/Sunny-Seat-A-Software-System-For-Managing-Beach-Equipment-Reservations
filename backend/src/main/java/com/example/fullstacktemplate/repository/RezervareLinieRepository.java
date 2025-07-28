package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.RezervareLinie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RezervareLinieRepository extends JpaRepository<RezervareLinie, Integer> {

    // 🔍 GĂSEȘTE LINIILE UNEI REZERVĂRI
    /**
     * Găsește toate liniile unei rezervări specifice
     */
    List<RezervareLinie> findByRezervareId(Integer rezervareId);

    // 🔍 GĂSEȘTE LINIILE REZERVĂRILOR UNUI UTILIZATOR
    /**
     * Găsește toate liniile rezervărilor unui utilizator
     */
    @Query("SELECT rl FROM RezervareLinie rl WHERE rl.rezervare.utilizator.email = :email ORDER BY rl.rezervare.createdAt DESC")
    List<RezervareLinie> findByRezervareUtilizatorEmail(@Param("email") String email);

    // 🔍 GĂSEȘTE LINIILE PENTRU O DATĂ SPECIFICĂ
    /**
     * Găsește toate liniile care au rezervări în perioada specificată
     */
    @Query("SELECT rl FROM RezervareLinie rl WHERE rl.dataInceput <= :data AND rl.dataSfarsit >= :data")
    List<RezervareLinie> findByDataInInterval(@Param("data") LocalDate data);

    // 🔍 GĂSEȘTE LINIILE DINTR-UN INTERVAL DE DATE
    /**
     * Găsește toate liniile dintr-un interval de date
     */
    @Query("SELECT rl FROM RezervareLinie rl WHERE rl.dataInceput >= :dataStart AND rl.dataSfarsit <= :dataEnd")
    List<RezervareLinie> findByDataBetween(@Param("dataStart") LocalDate dataStart, @Param("dataEnd") LocalDate dataEnd);

    // 🔍 GĂSEȘTE LINIILE PENTRU UN TIP DE ECHIPAMENT
    /**
     * Găsește toate liniile pentru un anumit tip de echipament
     */
    List<RezervareLinie> findByTipEchipamentId(Integer tipEchipamentId);

    // 🔍 GĂSEȘTE LINIILE PENTRU UN ECHIPAMENT SPECIFIC
    /**
     * Găsește toate liniile pentru un echipament specific
     */
    List<RezervareLinie> findByEchipamentId(Integer echipamentId);

    // 📊 STATISTICI
    /**
     * Calculează total cantitate pentru un tip de echipament într-o dată
     */
    @Query("SELECT SUM(rl.cantitate) FROM RezervareLinie rl WHERE rl.tipEchipament.id = :tipEchipamentId AND rl.dataInceput <= :data AND rl.dataSfarsit >= :data")
    Long getTotalCantitatePentruTipEchipamentLaData(@Param("tipEchipamentId") Integer tipEchipamentId, @Param("data") LocalDate data);

    /**
     * Calculează total venit dintr-un tip de echipament
     */
    @Query("SELECT SUM(rl.pretCalculat) FROM RezervareLinie rl WHERE rl.tipEchipament.id = :tipEchipamentId")
    Long getTotalVenitPentruTipEchipament(@Param("tipEchipamentId") Integer tipEchipamentId);

    /**
     * Numără liniile unei rezervări
     */
    Long countByRezervareId(Integer rezervareId);

    // 🔍 GĂSEȘTE LINIILE ACTIVE (rezervări nu anulate)
    /**
     * Găsește liniile rezervărilor active (nu anulate)
     */
    @Query("SELECT rl FROM RezervareLinie rl WHERE rl.rezervare.stareRezervare != 'ANULATA'")
    List<RezervareLinie> findActiveLinii();

    // 🔍 GĂSEȘTE LINIILE CONFIRMATE PENTRU O DATĂ
    /**
     * Găsește liniile rezervărilor confirmate pentru o anumită dată
     */
    @Query("SELECT rl FROM RezervareLinie rl WHERE rl.rezervare.stareRezervare = 'CONFIRMATA' AND rl.dataInceput <= :data AND rl.dataSfarsit >= :data")
    List<RezervareLinie> findConfirmateLiniiLaData(@Param("data") LocalDate data);

    // 🔍 VERIFICARE DISPONIBILITATE ECHIPAMENT
    /**
     * Verifică câte rezervări active sunt pentru un echipament într-o perioadă
     */
    @Query("SELECT COUNT(rl) FROM RezervareLinie rl WHERE rl.echipament.id = :echipamentId " +
           "AND rl.rezervare.stareRezervare = 'CONFIRMATA' " +
           "AND ((rl.dataInceput <= :dataStart AND rl.dataSfarsit >= :dataStart) " +
           "OR (rl.dataInceput <= :dataEnd AND rl.dataSfarsit >= :dataEnd) " +
           "OR (rl.dataInceput >= :dataStart AND rl.dataSfarsit <= :dataEnd))")
    Long countRezervariActiveForEchipamentInPeriod(@Param("echipamentId") Integer echipamentId, 
                                                   @Param("dataStart") LocalDate dataStart, 
                                                   @Param("dataEnd") LocalDate dataEnd);
}