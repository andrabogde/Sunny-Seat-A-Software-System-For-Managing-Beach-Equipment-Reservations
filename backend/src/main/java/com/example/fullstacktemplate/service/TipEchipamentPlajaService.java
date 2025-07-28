package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import com.example.fullstacktemplate.repository.TipEchipamentPlajaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TipEchipamentPlajaService {

    private static final Logger logger = LoggerFactory.getLogger(TipEchipamentPlajaService.class);

    @Autowired
    private TipEchipamentPlajaRepository tipEchipamentPlajaRepository;

    // ==================== METODE CRUD DE BAZĂ ====================
    
    public List<TipEchipamentPlaja> getAllTipuriEchipament() {
        return tipEchipamentPlajaRepository.findAll();
    }

    public Optional<TipEchipamentPlaja> getTipEchipamentById(Integer id) {
        try {
            Optional<TipEchipamentPlaja> tipEchipament = tipEchipamentPlajaRepository.findById(id);
            if (tipEchipament.isPresent()) {
                logger.info("✅ TipEchipament găsit: ID={}, Nume={}", id, tipEchipament.get().getDenumire());
            } else {
                logger.warn("⚠️ TipEchipament cu ID={} nu a fost găsit", id);
            }
            return tipEchipament;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea TipEchipament cu ID={}", id, e);
            return Optional.empty();
        }
    }

    public TipEchipamentPlaja saveTipEchipament(TipEchipamentPlaja tipEchipament) {
        try {
            // Setează data de creare dacă este nou
            if (tipEchipament.getId() == null && tipEchipament.getDataOra() == null) {
                tipEchipament.setDataOra(LocalDateTime.now());
            }
            
            TipEchipamentPlaja saved = tipEchipamentPlajaRepository.save(tipEchipament);
            logger.info("💾 TipEchipament salvat: ID={}, Nume={}", saved.getId(), saved.getDenumire());
            return saved;
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea TipEchipament: {}", tipEchipament.getDenumire(), e);
            throw new RuntimeException("Eroare la salvarea tipului de echipament", e);
        }
    }

    public void deleteTipEchipament(Integer id) {
        try {
            Optional<TipEchipamentPlaja> tipEchipament = getTipEchipamentById(id);
            if (tipEchipament.isPresent()) {
                tipEchipamentPlajaRepository.deleteById(id);
                logger.info("🗑️ TipEchipament șters: ID={}, Nume={}", id, tipEchipament.get().getDenumire());
            } else {
                logger.warn("⚠️ Tentativă de ștergere pentru TipEchipament inexistent: ID={}", id);
            }
        } catch (Exception e) {
            logger.error("❌ Eroare la ștergerea TipEchipament cu ID={}", id, e);
            throw new RuntimeException("Eroare la ștergerea tipului de echipament", e);
        }
    }

    // ==================== METODE DE CĂUTARE (SIMPLIFICATE) ====================

    /**
     * 🔧 CORECTARE: Găsește tipul de echipament după denumire exactă
     */
    public Optional<TipEchipamentPlaja> findByDenumire(String denumire) {
        try {
            // Dacă ai metoda în repository
            Optional<TipEchipamentPlaja> tipEchipament = tipEchipamentPlajaRepository.findByDenumireIgnoreCase(denumire);
            if (tipEchipament.isPresent()) {
                logger.info("✅ TipEchipament găsit după denumire: '{}'", denumire);
            } else {
                logger.warn("⚠️ TipEchipament cu denumirea '{}' nu a fost găsit", denumire);
            }
            return tipEchipament;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea TipEchipament cu denumirea '{}'", denumire, e);
            // Fallback: caută manual
            return tipEchipamentPlajaRepository.findAll().stream()
                    .filter(tip -> tip.getDenumire().equalsIgnoreCase(denumire))
                    .findFirst();
        }
    }

    /**
     * 🔧 CORECTARE: Verifică dacă există un tip de echipament cu o anumită denumire
     */
    public boolean existsByDenumire(String denumire) {
        try {
            // Dacă ai metoda în repository
            boolean exists = tipEchipamentPlajaRepository.existsByDenumireIgnoreCase(denumire);
            logger.info("🔍 TipEchipament cu denumirea '{}' {} exist", denumire, exists ? "EXISTĂ" : "NU");
            return exists;
        } catch (Exception e) {
            logger.error("❌ Eroare la verificarea existenței tipului '{}'", denumire, e);
            // Fallback: verifică manual
            return tipEchipamentPlajaRepository.findAll().stream()
                    .anyMatch(tip -> tip.getDenumire().equalsIgnoreCase(denumire));
        }
    }

    /**
     * 🔧 NOUĂ: Găsește tipuri de echipament care conțin o anumită denumire
     */
    public List<TipEchipamentPlaja> findByDenumireContaining(String denumire) {
        try {
            // Căutare manuală prin toate tipurile (funcționează mereu)
            List<TipEchipamentPlaja> tipuri = tipEchipamentPlajaRepository.findAll().stream()
                    .filter(tip -> tip.getDenumire().toLowerCase().contains(denumire.toLowerCase()))
                    .toList();
            
            logger.info("🔍 Găsite {} tipuri de echipament cu denumirea care conține '{}'", tipuri.size(), denumire);
            return tipuri;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea tipurilor de echipament cu denumirea '{}'", denumire, e);
            return List.of();
        }
    }

    // ==================== METODE DE VALIDARE ====================

    /**
     * Validează un tip de echipament înainte de salvare
     */
    public boolean isValid(TipEchipamentPlaja tipEchipament) {
        if (tipEchipament == null) {
            logger.warn("⚠️ TipEchipament este null");
            return false;
        }
        
        if (tipEchipament.getDenumire() == null || tipEchipament.getDenumire().trim().isEmpty()) {
            logger.warn("⚠️ TipEchipament nu are denumire");
            return false;
        }
        
        // Verifică unicitatea denumirii (doar pentru tipuri noi)
        if (tipEchipament.getId() == null && existsByDenumire(tipEchipament.getDenumire())) {
            logger.warn("⚠️ TipEchipament cu denumirea '{}' există deja", tipEchipament.getDenumire());
            return false;
        }
        
        return true;
    }

    // ==================== METODE STATISTICE ====================

    /**
     * Numără toate tipurile de echipament
     */
    public long countAll() {
        try {
            long count = tipEchipamentPlajaRepository.count();
            logger.info("📊 Total tipuri de echipament: {}", count);
            return count;
        } catch (Exception e) {
            logger.error("❌ Eroare la numărarea tipurilor de echipament", e);
            return 0;
        }
    }
}