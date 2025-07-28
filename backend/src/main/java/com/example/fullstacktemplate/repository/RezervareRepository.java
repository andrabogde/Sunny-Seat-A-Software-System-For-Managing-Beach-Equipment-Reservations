package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.Rezervare;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RezervareRepository extends JpaRepository<Rezervare, Integer> {

    // 🔍 CĂUTARE DUPĂ EMAIL UTILIZATOR
    /**
     * Găsește toate rezervările unui utilizator după email-ul acestuia
     */
    @Query("SELECT r FROM Rezervare r WHERE r.utilizator.email = :email ORDER BY r.createdAt DESC")
    List<Rezervare> findByUtilizatorEmail(@Param("email") String email);

    // 🔍 CĂUTARE DUPĂ ID UTILIZATOR
    /**
     * Găsește toate rezervările unui utilizator după ID-ul acestuia
     */
    @Query("SELECT r FROM Rezervare r WHERE r.utilizator.id = :utilizatorId ORDER BY r.createdAt DESC")
    List<Rezervare> findByUtilizatorId(@Param("utilizatorId") Long utilizatorId);

    // 🔍 CĂUTARE DUPĂ STARE
    /**
     * Găsește toate rezervările cu o anumită stare
     */
    List<Rezervare> findByStareRezervareIgnoreCase(String stareRezervare);

    // 🔍 CĂUTARE DUPĂ COD REZERVARE
    /**
     * Găsește o rezervare după codul unic
     */
    Optional<Rezervare> findByCodRezervare(String codRezervare);

    // 🔍 VERIFICARE EXISTENȚĂ COD
    /**
     * Verifică dacă există o rezervare cu un anumit cod
     */
    boolean existsByCodRezervare(String codRezervare);

    // 🔍 CĂUTARE DUPĂ DATA REZERVĂRII
    /**
     * Găsește rezervările pentru o anumită dată
     */
    List<Rezervare> findByDataRezervare(LocalDate dataRezervare);

    // 🔍 CĂUTARE DUPĂ INTERVALUL DE DATE
    /**
     * Găsește rezervările dintr-un interval de date
     */
    @Query("SELECT r FROM Rezervare r WHERE r.dataRezervare BETWEEN :dataStart AND :dataEnd ORDER BY r.dataRezervare ASC")
    List<Rezervare> findByDataRezervareeBetween(@Param("dataStart") LocalDate dataStart, @Param("dataEnd") LocalDate dataEnd);

    // 🔍 REZERVĂRI ACTIVE (NU ANULATE)
    /**
     * Găsește toate rezervările active (nu anulate)
     */
    @Query("SELECT r FROM Rezervare r WHERE r.stareRezervare != 'ANULATA' ORDER BY r.createdAt DESC")
    List<Rezervare> findActiveRezervari();

    // 🔍 REZERVĂRI PENTRU UN UTILIZATOR ÎN INTERVALUL DE DATE
    /**
     * Găsește rezervările unui utilizator dintr-un interval de date
     */
    @Query("SELECT r FROM Rezervare r WHERE r.utilizator.email = :email AND r.dataRezervare BETWEEN :dataStart AND :dataEnd ORDER BY r.dataRezervare ASC")
    List<Rezervare> findByUtilizatorEmailAndDataBetween(@Param("email") String email, @Param("dataStart") LocalDate dataStart, @Param("dataEnd") LocalDate dataEnd);

    // 🔍 REZERVĂRI CONFIRMATA PENTRU O DATĂ SPECIFICĂ
    /**
     * Găsește rezervările confirmate pentru o anumită dată (pentru verificarea disponibilității)
     */
    @Query("SELECT r FROM Rezervare r WHERE r.dataRezervare = :data AND r.stareRezervare = 'CONFIRMATA'")
    List<Rezervare> findConfirmateByData(@Param("data") LocalDate data);

    // 🔍 REZERVARE SPECIFICĂ A UNUI UTILIZATOR
    /**
     * Găsește o rezervare specifică a unui utilizator (pentru securitate)
     */
    @Query("SELECT r FROM Rezervare r WHERE r.id = :rezervareId AND r.utilizator.email = :email")
    Optional<Rezervare> findByIdAndUtilizatorEmail(@Param("rezervareId") Integer rezervareId, @Param("email") String email);

    // 🔍 ULTIMELE REZERVĂRI ALE UNUI UTILIZATOR
    /**
     * Găsește ultimele N rezervări ale unui utilizator
     */
    @Query("SELECT r FROM Rezervare r WHERE r.utilizator.email = :email ORDER BY r.createdAt DESC")
    List<Rezervare> findTopByUtilizatorEmailOrderByCreatedAtDesc(@Param("email") String email);

    // 📊 STATISTICI
    /**
     * Numără rezervările unui utilizator
     */
    @Query("SELECT COUNT(r) FROM Rezervare r WHERE r.utilizator.email = :email")
    Long countByUtilizatorEmail(@Param("email") String email);

    /**
     * Numără rezervările cu o anumită stare
     */
    Long countByStareRezervareIgnoreCase(String stareRezervare);

    /**
     * Numără rezervările confirmate pentru o anumită dată
     */
    @Query("SELECT COUNT(r) FROM Rezervare r WHERE r.dataRezervare = :data AND r.stareRezervare = 'CONFIRMATA'")
    Long countConfirmateByData(@Param("data") LocalDate data);

    // 🔍 CĂUTARE DUPĂ STRIPE PAYMENT ID
    /**
     * Găsește rezervarea după Stripe Payment Intent ID
     */
    Optional<Rezervare> findByStripePaymentIntentId(String stripePaymentIntentId);

    // 🔍 REZERVĂRI CARE EXPIRĂ CURÂND (pentru notificări)
    /**
     * Găsește rezervările care expiră în următoarele N zile
     */
    @Query("SELECT r FROM Rezervare r WHERE r.dataRezervare BETWEEN :astazi AND :dataLimita AND r.stareRezervare = 'CONFIRMATA'")
    List<Rezervare> findRezervariExpiraSoon(@Param("astazi") LocalDate astazi, @Param("dataLimita") LocalDate dataLimita);

    @Query(value = """
        SELECT DISTINCT 
            CONCAT(ep.pozitie_linie, '-', ep.pozitie_coloana) as pozitie
        FROM rezervari_linii rl
        INNER JOIN echipamente_plaja ep ON rl.echipament_id = ep.id
        INNER JOIN rezervari r ON rl.rezervare_id = r.id
        WHERE (rl.data_inceput <= :dataSfarsit AND rl.data_sfarsit >= :dataInceput)
        AND r.stare_rezervare IN ('confirmata', 'completata')  
        AND ep.plaja_id = :plajaId
        AND ep.stare_echipament_id = 3   
        ORDER BY ep.pozitie_linie DESC
        """, nativeQuery = true)
    List<String> findReservedPositions(
        @Param("dataInceput") LocalDate dataInceput,
        @Param("dataSfarsit") LocalDate dataSfarsit,
        @Param("plajaId") Long plajaId
    );

    @Modifying
    @Query("DELETE FROM Rezervare r WHERE r.utilizator.id = :userId")
    int deleteByUserIdAndStatusIn(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Rezervare r WHERE r.utilizator.id = :userId AND r.stareRezervare IN ('CONFIRMATA', 'IN_ASTEPTARE')")
    long countActiveReservationsByUserId(@Param("userId") Long userId);


     @Query("SELECT COUNT(r) FROM Rezervare r WHERE r.stareRezervare IN ('CONFIRMATA', 'IN_ASTEPTARE')")
    long countActiveReservations();
    
    @Query("SELECT SUM(l.pretCalculat) FROM Rezervare r JOIN r.linii l WHERE r.stareRezervare = 'CONFIRMATA'")
    BigDecimal calculateTotalRevenue();
    
    @Query("SELECT COUNT(r) FROM Rezervare r WHERE DATE(r.createdAt) = CURRENT_DATE")
    long countTodayReservations();
    
    @Query("SELECT COUNT(DISTINCT r) FROM Rezervare r JOIN r.linii l WHERE l.dataSfarsit BETWEEN CURRENT_TIMESTAMP AND :tomorrow")
    long countExpiringReservations(@Param("tomorrow") LocalDateTime tomorrow);

    
    List<Rezervare> findAllByDataRezervareBetweenAndStareRezervare(LocalDateTime start, LocalDateTime end, String status);

    @Query("SELECT r FROM Rezervare r ORDER BY r.dataRezervare DESC")
    List<Rezervare> findRecentReservations(Pageable pageable);
    
    @Query("SELECT CASE WHEN COUNT(bl) > 0 THEN true ELSE false END " +
    "FROM RezervareLinie bl " +
    "JOIN bl.echipament e " +
    "JOIN bl.rezervare b " +
    "WHERE e.plaja.id = :plajaId " +
    "AND b.stareRezervare = 'CONFIRMATA' " +
    "AND bl.dataSfarsit >= CURRENT_TIMESTAMP")
    boolean existaRezervariActivePentruPlaja(@Param("plajaId") Integer beachId);
    @Query("SELECT CASE WHEN COUNT(bl) > 0 THEN true ELSE false END " +
    "FROM RezervareLinie bl " +
    "JOIN bl.echipament e " +
    "JOIN bl.rezervare b " +
    "WHERE e.plaja.firma.id = :firmaId " +
    "AND b.stareRezervare = 'CONFIRMATA' " +
    "AND bl.dataSfarsit >= CURRENT_TIMESTAMP")
    boolean existRezervariActivePentruFirma(@Param("firmaId") Integer firmaId);

}
