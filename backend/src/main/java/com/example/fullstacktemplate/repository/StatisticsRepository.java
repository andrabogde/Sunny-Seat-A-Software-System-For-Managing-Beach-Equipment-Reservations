package com.example.fullstacktemplate.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.fullstacktemplate.model.User;

import java.util.List;
import java.util.Map;

@Repository
public interface StatisticsRepository extends JpaRepository<User, Long> {

    // 1. Statistici utilizatori - returnează Map direct
    @Query(value = """
        SELECT 
            (SELECT COUNT(*) FROM users) as totalUtilizatori,
            (SELECT COUNT(*) FROM users 
             WHERE MONTH(created_at) = MONTH(CURDATE()) 
             AND YEAR(created_at) = YEAR(CURDATE())) as utilizatoriNoiLunaAceasta,
            (SELECT COUNT(*) FROM users 
             WHERE MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
             AND YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) as utilizatoriNoiLunaTrecuta
        """, nativeQuery = true)
    Map<String, Object> getUserStatistics();

    // 2. Statistici rezervări
    @Query(value = """
        SELECT 
            (SELECT COUNT(*) FROM rezervari 
             WHERE MONTH(created_at) = MONTH(CURDATE()) 
             AND YEAR(created_at) = YEAR(CURDATE())) as rezervariLunaAceasta,
            (SELECT COUNT(*) FROM rezervari 
             WHERE MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
             AND YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) as rezervariLunaTrecuta,
            (SELECT COALESCE(SUM(suma_platita), 0) FROM rezervari 
             WHERE MONTH(created_at) = MONTH(CURDATE()) 
             AND YEAR(created_at) = YEAR(CURDATE())
             AND stare_rezervare = 'confirmata') as venitLunaAceasta
        """, nativeQuery = true)
    Map<String, Object> getReservationStatistics();

    // 3. Top clienți activi - returnează List<Object[]>
    @Query(value = """
        SELECT u.name as numeClient, u.email, COUNT(r.id) as numarRezervari,
               COALESCE(SUM(r.suma_platita), 0) as totalCheltuit,
               MAX(r.created_at) as ultimaRezervare
        FROM users u
        INNER JOIN rezervari r ON u.id = r.utilizator_id
        WHERE r.stare_rezervare IN ('confirmata', 'completata')
        GROUP BY u.id, u.name, u.email
        ORDER BY numarRezervari DESC, totalCheltuit DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> getTopActiveClients(@Param("limit") int limit);

    // 4. Clienți inactivi
    @Query(value = """
        SELECT u.name as numeClient, u.email, MAX(r.created_at) as ultimaRezervare,
               DATEDIFF(CURDATE(), MAX(r.created_at)) as zileDeLaUltimaRezervare
        FROM users u
        LEFT JOIN rezervari r ON u.id = r.utilizator_id
        WHERE r.id IS NOT NULL
        GROUP BY u.id, u.name, u.email
        HAVING zileDeLaUltimaRezervare > 90
        ORDER BY zileDeLaUltimaRezervare DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> getInactiveClients(@Param("limit") int limit);

    // 5. Performanța plajelor
    @Query(value = """
        SELECT p.denumire as numePlaja, s.denumire as statiune,
               COUNT(rl.id) as numarRezervari,
               COALESCE(SUM(rl.pret_calculat), 0) as venitTotal,
               AVG(rl.pret_calculat) as pretMediuRezervare
        FROM plaje p
        INNER JOIN statiuni s ON p.statiuni_id = s.id
        INNER JOIN echipamente_plaja ep ON p.id = ep.plaja_id
        INNER JOIN rezervari_linii rl ON ep.id = rl.echipament_id
        INNER JOIN rezervari r ON rl.rezervare_id = r.id
        WHERE r.stare_rezervare IN ('confirmata', 'completata')
        GROUP BY p.id, p.denumire, s.denumire
        ORDER BY numarRezervari DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> getTopBeachPerformance(@Param("limit") int limit);

    // 6. Statistici echipamente
    @Query(value = """
        SELECT te.denumire as tipEchipament,
               COUNT(ep.id) as numarTotalEchipamente,
               COUNT(rl.id) as numarRezervari,
               COALESCE(SUM(rl.pret_calculat), 0) as venitGenerat,
               ROUND((COUNT(rl.id) * 100.0 / COUNT(ep.id)), 2) as rataUtilizare
        FROM tipuri_echipamente_plaja te
        LEFT JOIN echipamente_plaja ep ON te.id = ep.tip_echipament_id
        LEFT JOIN rezervari_linii rl ON ep.id = rl.echipament_id
        LEFT JOIN rezervari r ON rl.rezervare_id = r.id 
            AND r.stare_rezervare IN ('confirmata', 'completata')
        GROUP BY te.id, te.denumire
        ORDER BY venitGenerat DESC
        """, nativeQuery = true)
    List<Object[]> getEquipmentStatistics();

    // 7. Analiza sezonieră
    @Query(value = """
        SELECT DATE_FORMAT(r.created_at, '%Y-%m') as luna,
               COUNT(*) as numarRezervari,
               COALESCE(SUM(r.suma_platita), 0) as venitLunar
        FROM rezervari r
        WHERE r.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND r.stare_rezervare IN ('confirmata', 'completata')
        GROUP BY DATE_FORMAT(r.created_at, '%Y-%m')
        ORDER BY luna
        """, nativeQuery = true)
    List<Object[]> getSeasonalAnalysis();

    // 8. Distribuția pe stațiuni
    @Query(value = """
        SELECT s.denumire as statiune,
               COUNT(DISTINCT p.id) as numarPlaje,
               COUNT(rl.id) as numarRezervari,
               COALESCE(SUM(rl.pret_calculat), 0) as venitTotal
        FROM statiuni s
        INNER JOIN plaje p ON s.id = p.statiuni_id
        INNER JOIN echipamente_plaja ep ON p.id = ep.plaja_id
        INNER JOIN rezervari_linii rl ON ep.id = rl.echipament_id
        INNER JOIN rezervari r ON rl.rezervare_id = r.id
        WHERE r.stare_rezervare IN ('confirmata', 'completata')
        GROUP BY s.id, s.denumire
        ORDER BY venitTotal DESC
        """, nativeQuery = true)
    List<Object[]> getResortDistribution();
}
