package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.RezervareLinie;
import com.example.fullstacktemplate.repository.RezervareLinieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RezervareLinieService {

    private static final Logger logger = LoggerFactory.getLogger(RezervareLinieService.class);

    @Autowired
    private RezervareLinieRepository rezervareLinieRepository;

    // ==================== METODE CRUD DE BAZĂ ====================
    
    public List<RezervareLinie> getAllRezervariLinii() {
        return rezervareLinieRepository.findAll();
    }

    public Optional<RezervareLinie> getRezervareLinieById(Integer id) {
        return rezervareLinieRepository.findById(id);
    }

    public RezervareLinie saveRezervareLinie(RezervareLinie rezervareLinie) {
        try {
            RezervareLinie saved = rezervareLinieRepository.save(rezervareLinie);
            logger.info("💾 Linie rezervare salvată: ID={}, Cantitate={}, Tip={}", 
                       saved.getId(), saved.getCantitate(), saved.getTipEchipamentNume());
            return saved;
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea liniei rezervării", e);
            throw new RuntimeException("Eroare la salvarea liniei rezervării", e);
        }
    }

    public void deleteRezervareLinie(Integer id) {
        try {
            rezervareLinieRepository.deleteById(id);
            logger.info("🗑️ Linie rezervare ștearsă: ID={}", id);
        } catch (Exception e) {
            logger.error("❌ Eroare la ștergerea liniei rezervării cu ID={}", id, e);
            throw new RuntimeException("Eroare la ștergerea liniei rezervării", e);
        }
    }

    // ==================== METODE DE CĂUTARE ====================

    /**
     * Găsește toate liniile unei rezervări specifice
     */
    public List<RezervareLinie> getLiniiByRezervareId(Integer rezervareId) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareId(rezervareId);
            logger.info("🔍 Găsite {} linii pentru rezervarea cu ID={}", linii.size(), rezervareId);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor pentru rezervarea {}", rezervareId, e);
            throw new RuntimeException("Eroare la căutarea liniilor rezervării", e);
        }
    }

    /**
     * Găsește toate liniile rezervărilor unui utilizator
     */
    public List<RezervareLinie> getLiniiByUtilizatorEmail(String email) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareUtilizatorEmail(email);
            logger.info("🔍 Găsite {} linii pentru utilizatorul {}", linii.size(), email);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor pentru utilizatorul {}", email, e);
            throw new RuntimeException("Eroare la căutarea liniilor utilizatorului", e);
        }
    }

    /**
     * Găsește liniile active pentru o dată specifică
     */
    public List<RezervareLinie> getLiniiActiveForData(LocalDate data) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByDataInInterval(data);
            logger.info("🔍 Găsite {} linii active pentru data {}", linii.size(), data);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor pentru data {}", data, e);
            throw new RuntimeException("Eroare la căutarea liniilor pentru dată", e);
        }
    }

    /**
     * Găsește liniile dintr-un interval de date
     */
    public List<RezervareLinie> getLiniiInInterval(LocalDate dataStart, LocalDate dataEnd) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByDataBetween(dataStart, dataEnd);
            logger.info("🔍 Găsite {} linii în intervalul {} - {}", linii.size(), dataStart, dataEnd);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor în intervalul {} - {}", dataStart, dataEnd, e);
            throw new RuntimeException("Eroare la căutarea liniilor în interval", e);
        }
    }

    /**
     * Găsește liniile pentru un tip de echipament
     */
    public List<RezervareLinie> getLiniiByTipEchipament(Integer tipEchipamentId) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByTipEchipamentId(tipEchipamentId);
            logger.info("🔍 Găsite {} linii pentru tipul de echipament cu ID={}", linii.size(), tipEchipamentId);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor pentru tipul de echipament {}", tipEchipamentId, e);
            throw new RuntimeException("Eroare la căutarea liniilor pentru tipul de echipament", e);
        }
    }

    /**
     * Găsește liniile pentru un echipament specific
     */
    public List<RezervareLinie> getLiniiByEchipament(Integer echipamentId) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByEchipamentId(echipamentId);
            logger.info("🔍 Găsite {} linii pentru echipamentul cu ID={}", linii.size(), echipamentId);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor pentru echipamentul {}", echipamentId, e);
            throw new RuntimeException("Eroare la căutarea liniilor pentru echipament", e);
        }
    }

    /**
     * Găsește liniile rezervărilor active (nu anulate)
     */
    public List<RezervareLinie> getLiniiActive() {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findActiveLinii();
            logger.info("🔍 Găsite {} linii active", linii.size());
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor active", e);
            throw new RuntimeException("Eroare la căutarea liniilor active", e);
        }
    }

    /**
     * Găsește liniile rezervărilor confirmate pentru o dată
     */
    public List<RezervareLinie> getLiniiConfirmateForData(LocalDate data) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findConfirmateLiniiLaData(data);
            logger.info("🔍 Găsite {} linii confirmate pentru data {}", linii.size(), data);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea liniilor confirmate pentru data {}", data, e);
            throw new RuntimeException("Eroare la căutarea liniilor confirmate", e);
        }
    }

    // ==================== METODE STATISTICE ====================

    /**
     * Calculează total cantitate pentru un tip de echipament la o dată
     */
    public Long getTotalCantitateTipEchipamentLaData(Integer tipEchipamentId, LocalDate data) {
        try {
            Long total = rezervareLinieRepository.getTotalCantitatePentruTipEchipamentLaData(tipEchipamentId, data);
            logger.info("📊 Total cantitate pentru tipul {} la data {}: {}", tipEchipamentId, data, total);
            return total != null ? total : 0L;
        } catch (Exception e) {
            logger.error("❌ Eroare la calcularea cantității pentru tipul {} la data {}", tipEchipamentId, data, e);
            return 0L;
        }
    }

    /**
     * Calculează total venit dintr-un tip de echipament
     */
    public Long getTotalVenitTipEchipament(Integer tipEchipamentId) {
        try {
            Long total = rezervareLinieRepository.getTotalVenitPentruTipEchipament(tipEchipamentId);
            logger.info("📊 Total venit pentru tipul {}: {}", tipEchipamentId, total);
            return total != null ? total : 0L;
        } catch (Exception e) {
            logger.error("❌ Eroare la calcularea venitului pentru tipul {}", tipEchipamentId, e);
            return 0L;
        }
    }

    /**
     * Numără liniile unei rezervări
     */
    public Long countLiniiByRezervare(Integer rezervareId) {
        try {
            Long count = rezervareLinieRepository.countByRezervareId(rezervareId);
            logger.info("📊 Numărul de linii pentru rezervarea {}: {}", rezervareId, count);
            return count != null ? count : 0L;
        } catch (Exception e) {
            logger.error("❌ Eroare la numărarea liniilor pentru rezervarea {}", rezervareId, e);
            return 0L;
        }
    }

    // ==================== METODE DE DISPONIBILITATE ====================

    /**
     * Verifică disponibilitatea unui echipament într-o perioadă
     */
    public boolean isEchipamentDisponibil(Integer echipamentId, LocalDate dataStart, LocalDate dataEnd) {
        try {
            Long count = rezervareLinieRepository.countRezervariActiveForEchipamentInPeriod(
                echipamentId, dataStart, dataEnd);
            
            boolean disponibil = (count == null || count == 0);
            logger.info("🔍 Echipamentul {} este {} în perioada {} - {}", 
                       echipamentId, disponibil ? "disponibil": "rezervat", dataStart, dataEnd);
            
            return disponibil;
        } catch (Exception e) {
            logger.error("❌ Eroare la verificarea disponibilității echipamentului {} în perioada {} - {}", 
                        echipamentId, dataStart, dataEnd, e);
            return false;
        }
    }

    /**
     * Obține numărul de rezervări active pentru un echipament într-o perioadă
     */
    public Long getNumarRezervariActiveEchipament(Integer echipamentId, LocalDate dataStart, LocalDate dataEnd) {
        try {
            Long count = rezervareLinieRepository.countRezervariActiveForEchipamentInPeriod(
                echipamentId, dataStart, dataEnd);
            
            logger.info("📊 Echipamentul {} are {} rezervări active în perioada {} - {}", 
                       echipamentId, count, dataStart, dataEnd);
            
            return count != null ? count : 0L;
        } catch (Exception e) {
            logger.error("❌ Eroare la numărarea rezervărilor pentru echipamentul {} în perioada {} - {}", 
                        echipamentId, dataStart, dataEnd, e);
            return 0L;
        }
    }

    // ==================== METODE DE BATCH ====================

    /**
     * Salvează multiple linii pentru o rezervare
     */
    @Transactional
    public List<RezervareLinie> saveMultipleLinii(List<RezervareLinie> linii) {
        try {
            List<RezervareLinie> savedLinii = rezervareLinieRepository.saveAll(linii);
            logger.info("💾 Salvate {} linii în batch", savedLinii.size());
            return savedLinii;
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea în batch a {} linii", linii.size(), e);
            throw new RuntimeException("Eroare la salvarea liniilor în batch", e);
        }
    }

    /**
     * Șterge toate liniile unei rezervări
     */
    @Transactional
    public void deleteLiniiByRezervareId(Integer rezervareId) {
        try {
            List<RezervareLinie> linii = getLiniiByRezervareId(rezervareId);
            rezervareLinieRepository.deleteAll(linii);
            logger.info("🗑️ Șterse {} linii pentru rezervarea {}", linii.size(), rezervareId);
        } catch (Exception e) {
            logger.error("❌ Eroare la ștergerea liniilor pentru rezervarea {}", rezervareId, e);
            throw new RuntimeException("Eroare la ștergerea liniilor rezervării", e);
        }
    }
}