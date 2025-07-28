package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.EchipamentPlaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

@Repository
public interface EchipamentPlajaRepository extends JpaRepository<EchipamentPlaja, Integer> {

       // 🔍 CĂUTARE DUPĂ PLAJĂ
       /**
        * Găsește toate echipamentele unei plaje
        */
       List<EchipamentPlaja> findByPlajaId(Integer plajaId);

       /**
        * Găsește echipamentele disponibile ale unei plaje
        */
       List<EchipamentPlaja> findByPlajaIdAndDisponibilTrue(Integer plajaId);

       /**
        * Găsește echipamentele active ale unei plaje
        */
       List<EchipamentPlaja> findByPlajaIdAndActivTrue(Integer plajaId);

       // 🔍 CĂUTARE DUPĂ TIP ECHIPAMENT
       /**
        * Găsește toate echipamentele unui anumit tip
        */
       List<EchipamentPlaja> findByTipEchipamentId(Integer tipEchipamentId);

       /**
        * Găsește echipamentele disponibile de un anumit tip
        */
       List<EchipamentPlaja> findByTipEchipamentIdAndDisponibilTrue(Integer tipEchipamentId);

       // 🔍 CĂUTARE DUPĂ DISPONIBILITATE
       /**
        * Găsește toate echipamentele disponibile
        */
       List<EchipamentPlaja> findByDisponibilTrue();

       /**
        * Găsește toate echipamentele indisponibile
        */
       List<EchipamentPlaja> findByDisponibilFalse();

       // 🔍 CĂUTARE DUPĂ STARE
       /**
        * Găsește echipamentele cu o anumită stare
        */
       List<EchipamentPlaja> findByStareEchipamentId(Integer stareEchipamentId);

       // 🔍 CĂUTARE DUPĂ POZIȚIE
       /**
        * Găsește echipamentul la o poziție specifică pe o plajă
        */
       Optional<EchipamentPlaja> findByPlajaIdAndPozitieLinieAndPozitieColoana(
                     Integer plajaId, Integer pozitieLinie, Integer pozitieColoana);

       /**
        * Găsește echipamentele dintr-o linie specifică
        */
       List<EchipamentPlaja> findByPlajaIdAndPozitieLinie(Integer plajaId, Integer pozitieLinie);

       // 🔍 CĂUTARE DUPĂ DENUMIRE
       /**
        * Găsește echipamente după denumire (case insensitive)
        */
       List<EchipamentPlaja> findByDenumireContainingIgnoreCase(String denumire);

       /**
        * Găsește echipamente după denumire exactă
        */
       Optional<EchipamentPlaja> findByDenumireIgnoreCase(String denumire);

       // 🔍 CĂUTĂRI AVANSATE
       /**
        * Găsește echipamentele unei plaje cu un anumit tip și disponibile
        */
       @Query("SELECT e FROM EchipamentPlaja e WHERE e.plaja.id = :plajaId " +
                     "AND e.tipEchipament.id = :tipEchipamentId AND e.disponibil = true AND e.activ = true")
       List<EchipamentPlaja> findAvailableByPlajaAndTip(@Param("plajaId") Integer plajaId,
                     @Param("tipEchipamentId") Integer tipEchipamentId);

       /**
        * Găsește echipamentele cu cel mai mic preț pentru un tip
        */
       @Query("SELECT e FROM EchipamentPlaja e JOIN Pret p ON e.id = p.echipamentPlajaId " +
                     "WHERE e.tipEchipament.id = :tipEchipamentId AND e.disponibil = true " +
                     "AND p.dataOra = (SELECT MAX(p2.dataOra) FROM Pret p2 WHERE p2.echipamentPlajaId = e.id) " +
                     "ORDER BY p.valoare ASC")
       List<EchipamentPlaja> findCheapestByTipEchipament(@Param("tipEchipamentId") Integer tipEchipamentId);

       // 📊 STATISTICI
       /**
        * Numără echipamentele disponibile
        */
       Long countByDisponibilTrue();

       /**
        * Numără echipamentele indisponibile
        */
       Long countByDisponibilFalse();

       /**
        * Numără echipamentele unei plaje
        */
       Long countByPlajaId(Integer plajaId);

       /**
        * Numără echipamentele unui tip
        */
       Long countByTipEchipamentId(Integer tipEchipamentId);

       /**
        * Numără echipamentele disponibile ale unei plaje
        */
       Long countByPlajaIdAndDisponibilTrue(Integer plajaId);

       // 🔍 VERIFICĂRI
       /**
        * Verifică dacă există un echipament la o poziție specifică
        */
       boolean existsByPlajaIdAndPozitieLinieAndPozitieColoana(
                     Integer plajaId, Integer pozitieLinie, Integer pozitieColoana);

       /**
        * Verifică dacă există echipamente disponibile pentru un tip pe o plajă
        */
       boolean existsByPlajaIdAndTipEchipamentIdAndDisponibilTrue(Integer plajaId, Integer tipEchipamentId);

       // 🔍 CĂUTĂRI PENTRU REZERVĂRI
       /**
        * Găsește echipamentele libere într-o perioadă (nu au rezervări confirmate)
        */
       @Query("SELECT e FROM EchipamentPlaja e WHERE e.plaja.id = :plajaId " +
                     "AND e.tipEchipament.id = :tipEchipamentId AND e.disponibil = true AND e.activ = true " +
                     "AND e.id NOT IN (SELECT rl.echipament.id FROM RezervareLinie rl " +
                     "WHERE rl.rezervare.stareRezervare = 'CONFIRMATA' " +
                     "AND ((rl.dataInceput <= :dataStart AND rl.dataSfarsit >= :dataStart) " +
                     "OR (rl.dataInceput <= :dataEnd AND rl.dataSfarsit >= :dataEnd) " +
                     "OR (rl.dataInceput >= :dataStart AND rl.dataSfarsit <= :dataEnd)))")
       List<EchipamentPlaja> findAvailableInPeriod(@Param("plajaId") Integer plajaId,
                     @Param("tipEchipamentId") Integer tipEchipamentId,
                     @Param("dataStart") java.time.LocalDate dataStart,
                     @Param("dataEnd") java.time.LocalDate dataEnd);

       /**
        * Numără echipamentele rezervate într-o zi
        */
       @Query("SELECT COUNT(DISTINCT rl.echipament.id) FROM RezervareLinie rl " +
                     "WHERE rl.rezervare.stareRezervare = 'CONFIRMATA' " +
                     "AND rl.dataInceput <= :data AND rl.dataSfarsit >= :data")
       Long countReservateInData(@Param("data") java.time.LocalDate data);

       // 🔍 ORDONATE DUPĂ POZIȚIE
       /**
        * Găsește toate echipamentele unei plaje ordonate după poziție
        */
       List<EchipamentPlaja> findByPlajaIdOrderByPozitieLinieAscPozitieColoanaAsc(Integer plajaId);

       /**
        * Găsește echipamentele disponibile ordonate după preț (necesar join cu Pret)
        */
       @Query("SELECT e FROM EchipamentPlaja e JOIN Pret p ON e.id = p.echipamentPlajaId " +
                     "WHERE e.plaja.id = :plajaId AND e.disponibil = true " +
                     "AND p.dataOra = (SELECT MAX(p2.dataOra) FROM Pret p2 WHERE p2.echipamentPlajaId = e.id) " +
                     "ORDER BY p.valoare ASC")
       List<EchipamentPlaja> findByPlajaIdOrderByPretAsc(@Param("plajaId") Integer plajaId);

       @Transactional
       @Modifying
       void deleteByPlajaId(Integer plajaId);
       @Transactional
       @Modifying
       @Query(value = """
                         DELETE FROM Pret p
                         WHERE p.echipamentPlajaId IN (
                             SELECT e.id FROM EchipamentPlaja e WHERE e.plaja.id = :plajaId
                         )
                     """)
       void deletePreturiByPlajaId(@Param("plajaId") Integer plajaId);

       @Query("SELECT COUNT(e) FROM EchipamentPlaja e WHERE e.stareEchipament.denumire IN ('Liber','Ocupat','Rezervat')")
       long countActiveEquipment();
       
       @Query("SELECT COUNT(e) FROM EchipamentPlaja e WHERE e.stareEchipament.denumire IN ('Nedefinit', 'Indisponibil')")
       long countProblematicEquipment();

}