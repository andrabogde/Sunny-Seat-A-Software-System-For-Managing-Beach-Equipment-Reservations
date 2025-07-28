package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.Plaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PlajaRepository extends JpaRepository<Plaja, Integer> {

    // Obține toate plajele active
    List<Plaja> findByActiv(Boolean activ);

    // Obține toate plajele dintr-o stațiune
    List<Plaja> findByStatiuneId(Integer statiuneId);
    List<Plaja> findByFirmaId(Integer firmaId);

    @Query(value = """
                  SELECT
                p.denumire as nume_plaja,
                s.denumire as statiune,
                COUNT(DISTINCT r.id) as numar_rezervari,
                COALESCE(SUM(rl.pret_calculat), 0) as venit_total,
                ROUND(AVG(rl.pret_calculat), 2) as pret_mediu_rezervare
            FROM plaje p
            INNER JOIN statiuni s ON p.statiuni_id = s.id
            INNER JOIN echipamente_plaja ep ON p.id = ep.plaja_id
            INNER JOIN rezervari_linii rl ON ep.id = rl.echipament_id
            INNER JOIN rezervari r ON rl.rezervare_id = r.id
            WHERE r.stare_rezervare IN ('confirmata', 'completata')
            AND r.created_at >= :dataInceput
            AND r.created_at <= :dataSfarsit
            GROUP BY p.id, p.denumire, s.denumire
            ORDER BY numar_rezervari DESC, venit_total DESC
            LIMIT :limita
                    """, nativeQuery = true)
    List<Object[]> getTopBeachPerformance(
            @Param("dataInceput") LocalDateTime dataInceput,
            @Param("dataSfarsit") LocalDateTime dataSfarsit,
            @Param("limita") int limita);

    @Query(value = """
            SELECT
                p.id as plaja_id,
                p.denumire as nume_plaja,
                s.denumire as statiune,
                COUNT(DISTINCT r.id) as numar_rezervari,
                COALESCE(SUM(rl.pret_calculat), 0) as venit_total,
                ROUND(AVG(rl.pret_calculat), 2) as pret_mediu_rezervare
            FROM plaje p
            INNER JOIN statiuni s ON p.statiuni_id = s.id
            INNER JOIN echipamente_plaja ep ON p.id = ep.plaja_id AND ep.activ = 1
            LEFT JOIN rezervari_linii rl ON ep.id = rl.echipament_id
            LEFT JOIN rezervari r ON rl.rezervare_id = r.id
                AND r.stare_rezervare IN ('confirmata', 'completata')
                AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL :luni MONTH)
            WHERE p.activ = 1
                AND (:stationId IS NULL OR s.id = :stationId)
            GROUP BY p.id, p.denumire, s.denumire
            HAVING COUNT(DISTINCT r.id) >= :minimRezervari
            ORDER BY numar_rezervari DESC, venit_total DESC
            LIMIT :limita
            """, nativeQuery = true)
    List<Object[]> getTopBeachPerformanceWithFilters(
            @Param("luni") int luni,
            @Param("stationId") Long stationId,
            @Param("minimRezervari") int minimRezervari,
            @Param("limita") int limita);

}
