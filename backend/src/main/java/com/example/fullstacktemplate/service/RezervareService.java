package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.dto.RezervareResponseDTO;
import com.example.fullstacktemplate.dto.RezervareResponseDTO.UtilizatorSimpleDTO;
import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.model.EchipamentPlaja;
import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.model.RezervareLinie;
import com.example.fullstacktemplate.model.StareEchipamentPlaja;
import com.example.fullstacktemplate.model.StareRezervare;
import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.RezervareRepository;
import com.example.fullstacktemplate.repository.RezervareLinieRepository;
import com.example.fullstacktemplate.repository.UserRepository;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.EchipamentPlajaRepository;

import org.apache.tomcat.jni.Local;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RezervareService {

    private static final Logger logger = LoggerFactory.getLogger(RezervareService.class);

    @Autowired
    private RezervareRepository rezervareRepository;

    @Autowired
    private RezervareLinieRepository rezervareLinieRepository;

    @Autowired
    private NotificareService notificareService;

    @Autowired
    private UserService userService;

    @Autowired
    private EchipamentPlajaRepository echipamentPlajaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CerereManagerRepository cerereManagerRepository;

    // Constantele pentru stările rezervării
    public static final String STARE_CONFIRMATA = "CONFIRMATA";
    public static final String STARE_ANULATA = "ANULATA";
    public static final String STARE_PENDING = "PENDING";
    public static final String STARE_FINALIZATA = "FINALIZATA";

    // ==================== METODELE EXISTENTE ACTUALIZATE ====================
    
    public List<Rezervare> getAllRezervari() {
        return rezervareRepository.findAll();
    }

     public List<RezervareResponseDTO> getAllRezervariDTO() {
        List<Rezervare> rezervari = rezervareRepository.findAll();
        return rezervari.stream()
        .map(el->{
            RezervareLinie rz=el.getLinii().get(0);
            Plaja plaja=rz.getEchipament().getPlaja();
            Firma firma=plaja.getFirma();
            System.out.println("Firma gasita este "+firma);
            CerereManager cr=cerereManagerRepository.findByCui(firma.getCui()).orElse(null);
            if(cr!=null){
                User user=userRepository.findByEmail(cr.getEmail()).orElse(null);
                if(user!=null){
                el.setUserId(user.getId().intValue());
                }
            }
            return el;
        })
                .map(this::mapToResponseDTO)
               
                .collect(Collectors.toList());
    }

    private RezervareResponseDTO mapToResponseDTO(Rezervare rezervare) {
        return RezervareResponseDTO.builder()
                .id(rezervare.getId())
                .codRezervare(rezervare.getCodRezervare())
                .utilizator(new UtilizatorSimpleDTO(rezervare.getUtilizator().getId(),rezervare.getUtilizator().getFullName(),rezervare.getUtilizator().getEmail()))
                .stareRezervare(rezervare.getStareRezervare())
                .plaja(rezervare.getLinii().get(0).getEchipament().getPlaja().getDenumire()) // Metodă pentru a obține numele plajei
                .dataInceput(rezervare.getLinii().get(0).getDataInceput())
                .dataSfarsit(rezervare.getLinii().get(0).getDataSfarsit())
                .userId(rezervare.getUserId())
                //.pretBucata(rezervare.)
                .cantitate(rezervare.getTotalCantitateEchipamente())
                .pretTotal(rezervare.getTotalCalculatDinLinii())
                .createdAt(rezervare.getCreatedAt())
                .build(); 
    }

    public Optional<Rezervare> getRezervareById(Integer id) {
        return rezervareRepository.findById(id);
    }

    public void deleteRezervare(Integer id) {
        rezervareRepository.deleteById(id);
    }

    /**
     * 🔄 ACTUALIZAT: Găsește rezervările unui utilizator cu liniile incluse
     */
    public List<Rezervare> getRezervariByUtilizatorEmail(String email) {
        try {
            List<Rezervare> rezervari = rezervareRepository.findByUtilizatorEmail(email);
            
            // Încarcă explicit liniile pentru fiecare rezervare
            for (Rezervare rezervare : rezervari) {
                List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareId(rezervare.getId());
                // Setează liniile în rezervare pentru afișare
                // rezervare.setLinii(linii); // Dacă ai această metodă în Rezervare
            }
            
            logger.info("🔍 Găsite {} rezervări pentru utilizatorul {}", rezervari.size(), email);
            return rezervari;
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea rezervărilor pentru utilizatorul {}", email, e);
            throw new RuntimeException("Eroare la încărcarea rezervărilor", e);
        }
    }

    /**
     * 🔄 ACTUALIZAT: Obține detaliile complete ale unei rezervări cu liniile incluse
     */
    public Map<String, Object> getRezervareDetaliiComplete(Integer rezervareId, String userEmail) {
        try {
            // Găsește rezervarea cu verificare că aparține utilizatorului
            Optional<Rezervare> rezervareOpt = rezervareRepository.findByIdAndUtilizatorEmail(rezervareId, userEmail);
            
            if (!rezervareOpt.isPresent()) {
                logger.warn("⚠️ Rezervarea {} nu există sau nu aparține utilizatorului {}", rezervareId, userEmail);
                return null;
            }
            
            Rezervare rezervare = rezervareOpt.get();
            
            // Încarcă liniile rezervării
            List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareId(rezervareId);
            
            // Construiește răspunsul cu detaliile complete
            Map<String, Object> detalii = new HashMap<>();
            
            // Informații de bază din rezervare
            detalii.put("id", rezervare.getId());
            detalii.put("codRezervare", rezervare.getCodRezervare());
            detalii.put("stareRezervare", rezervare.getStareRezervare());
            detalii.put("createdAt", rezervare.getCreatedAt());
            detalii.put("dataRezervare", rezervare.getDataRezervare());
            detalii.put("sumaPlatita", rezervare.getSumaPlatita());
            
            // 🆕 DETALII CALCULATE DIN LINII
            int totalCantitate = linii.stream().mapToInt(RezervareLinie::getCantitate).sum();
            double totalCalculat = linii.stream().mapToDouble(l -> l.getPretCalculat().doubleValue()).sum();
            String tipuriEchipament = linii.stream()
                    .map(RezervareLinie::getTipEchipamentNume)
                    .distinct()
                    .collect(Collectors.joining(", "));
            
            detalii.put("totalCantitateEchipamente", totalCantitate);
            detalii.put("totalCalculatDinLinii", totalCalculat);
            detalii.put("tipuriEchipamentRezervate", tipuriEchipament);
            
            // 🆕 LINIILE REZERVĂRII CU DETALII COMPLETE
            List<Map<String, Object>> liniiDetalii = linii.stream().map(linie -> {
                Map<String, Object> linieMap = new HashMap<>();
                linieMap.put("id", linie.getId());
                linieMap.put("cantitate", linie.getCantitate());
                linieMap.put("dataInceput", linie.getDataInceput());
                linieMap.put("dataSfarsit", linie.getDataSfarsit());
                linieMap.put("pretBucata", linie.getPretBucata());
                linieMap.put("pretCalculat", linie.getPretCalculat());
                linieMap.put("tipEchipamentNume", linie.getTipEchipamentNume());
                linieMap.put("echipamentNume", linie.getEchipamentNume());
                
                // Detalii tip echipament
                if (linie.getTipEchipament() != null) {
                    Map<String, Object> tipEchipament = new HashMap<>();
                    tipEchipament.put("id", linie.getTipEchipament().getId());
                    tipEchipament.put("nume", linie.getTipEchipament().getDenumire());
                    linieMap.put("tipEchipament", tipEchipament);
                }
                
                return linieMap;
            }).collect(Collectors.toList());
            
            detalii.put("linii", liniiDetalii);
            
            // Informații utilizator (doar cele necesare)
            if (rezervare.getUtilizator() != null) {
                Map<String, Object> utilizatorInfo = new HashMap<>();
                utilizatorInfo.put("id", rezervare.getUtilizator().getId());
                utilizatorInfo.put("nume", rezervare.getUtilizator().getName());
                utilizatorInfo.put("email", rezervare.getUtilizator().getEmail());
                detalii.put("utilizator", utilizatorInfo);
            }
            
            // Status flags pentru UI
            detalii.put("canCancel", canCancelRezervare(rezervare));
            detalii.put("canModify", canModifyRezervare(rezervare));
            
            logger.info("✅ Detalii complete încărcate pentru rezervarea {} cu {} linii", 
                       rezervare.getCodRezervare(), linii.size());
            return detalii;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la încărcarea detaliilor pentru rezervarea {}", rezervareId, e);
            throw new RuntimeException("Eroare la încărcarea detaliilor rezervării", e);
        }
    }

    /**
     * 🔄 ACTUALIZAT: Anulează rezervare cu ștergerea liniilor
     */
    @Transactional
    public boolean anulareRezervareUtilizator(Integer rezervareId, String userEmail) {
        try {
            // Găsește rezervarea cu verificare că aparține utilizatorului
            Optional<Rezervare> rezervareOpt = rezervareRepository.findByIdAndUtilizatorEmail(rezervareId, userEmail);
            
            if (!rezervareOpt.isPresent()) {
                logger.warn("⚠️ Tentativă de anulare neautorizată pentru rezervarea {} de către {}", rezervareId, userEmail);
                return false;
            }
            
            Rezervare rezervare = rezervareOpt.get();
            
            // Verifică dacă rezervarea poate fi anulată
            if (!canCancelRezervare(rezervare)) {
                logger.warn("⚠️ Rezervarea {} nu poate fi anulată (stare: {})", rezervare.getCodRezervare(), rezervare.getStareRezervare());
                return false;
            }
            
            String stareVeche = rezervare.getStareRezervare();
            
            // Anulează rezervarea
            rezervare.setStareRezervare(STARE_ANULATA);
            Rezervare savedRezervare = rezervareRepository.save(rezervare);
            List<RezervareLinie> linii=rezervareLinieRepository.findByRezervareId(savedRezervare.getId());
            EchipamentPlaja echipamentPlaja;
            StareEchipamentPlaja liber=new StareEchipamentPlaja();
            liber.setId(1);
            for (RezervareLinie linie : linii) {
                echipamentPlaja = linie.getEchipament();
                echipamentPlaja.setStareEchipament(liber);
                echipamentPlajaRepository.save(echipamentPlaja);
            }
            
            // Creează notificare
            createNotificationForStateChange(savedRezervare, stareVeche, STARE_ANULATA);
            
            logger.info("❌ Rezervare anulată cu succes: {} de către {}", rezervare.getCodRezervare(), userEmail);
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la anularea rezervării {} de către {}", rezervareId, userEmail, e);
            return false;
        }
    }

    // 🔄 METODĂ ACTUALIZATĂ: saveRezervare cu salvarea liniilor și setarea utilizatorului
    public Rezervare saveRezervare(Rezervare rezervare) {
        try {
            boolean isNewRezervare = (rezervare.getId() == null);
            String stareVeche = null;
            
            if (!isNewRezervare) {
                // Pentru rezervări existente, salvează starea veche
                Optional<Rezervare> existing = getRezervareById(rezervare.getId());
                stareVeche = existing.map(Rezervare::getStareRezervare).orElse(null);
            }
            
            // Dacă e rezervare nouă, setează câmpurile necesare
            if (isNewRezervare) {
                setupNewRezervare(rezervare);
            }
            
            // Salvează rezervarea
            Rezervare savedRezervare = rezervareRepository.save(rezervare);
            
            // 🔔 Creează notificare
            if (isNewRezervare) {
                // Pentru rezervări noi
                createNotificationForNewRezervare(savedRezervare);
            } else if (stareVeche != null && !stareVeche.equals(savedRezervare.getStareRezervare())) {
                // Pentru schimbări de stare
                createNotificationForStateChange(savedRezervare, stareVeche, savedRezervare.getStareRezervare());
            }
            
            return savedRezervare;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea rezervării", e);
            throw new RuntimeException("Eroare la salvarea rezervării", e);
        }
    }

    /**
     * 🆕 METODĂ NOUĂ: Salvează rezervare cu utilizatorul setat din authentication
     */
    public Rezervare saveRezervareWithUser(Rezervare rezervare, String userEmail) {
        try {
            // Găsește utilizatorul după email
            User utilizator = userService.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Utilizatorul cu email " + userEmail + " nu a fost găsit"));
            
            // Setează utilizatorul în rezervare
            rezervare.setUtilizator(utilizator);
            
            return saveRezervare(rezervare);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea rezervării cu utilizatorul {}", userEmail, e);
            throw new RuntimeException("Eroare la salvarea rezervării cu utilizator", e);
        }
    }




    @Transactional
public Rezervare createRezervareFromRequest(Map<String, Object> reservationData,String paymentIntentId) {
    Integer utilizatorId = (Integer) reservationData.get("utilizatorId");
    Integer plajaId = (Integer) reservationData.get("plajaId");
    String numePlaja = (String) reservationData.get("numePlaja");
    String statiune = (String) reservationData.get("statiune");
    String paymentOption = (String) reservationData.get("paymentOption");

    LocalDate dataRezervare = LocalDate.parse((String) reservationData.get("dataRezervare"));
    LocalDate dataInceput = LocalDate.parse((String) reservationData.get("dataInceput"));
    LocalDate dataSfarsit = LocalDate.parse((String) reservationData.get("dataSfarsit"));

    Double totalCalculat = ((Number) reservationData.get("totalCalculat")).doubleValue();
    List<Map<String, Object>> pozitiiSelectate = (List<Map<String, Object>>) reservationData.get("pozitiiSelectate");

    // 🧍 Caută utilizatorul
    User user = userRepository.findById(Long.valueOf(utilizatorId) )
        .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

    // 📦 Creează rezervarea
    Rezervare rezervare = new Rezervare();
    rezervare.setUtilizator(user);
    rezervare.setStripePaymentIntentId(paymentIntentId);
    rezervare.setCodRezervare(generateCodRezervare()); // metodă separată pentru cod
    rezervare.setCreatedAt(LocalDateTime.now());
    rezervare.setDataRezervare(dataRezervare);
    rezervare.setStareRezervare(STARE_CONFIRMATA);
    rezervare.setSumaPlatita(paymentOption.equals("full") ? totalCalculat : 0.0);

    // 🧾 Creează liniile de rezervare
    for (Map<String, Object> pozitie : pozitiiSelectate) {
        String id = (String) pozitie.get("id"); // de forma "1-2"
        String tip = (String) pozitie.get("type"); // ex: "sezlong"
        Integer row = (Integer) pozitie.get("row");
        Integer col = (Integer) pozitie.get("col");
        Integer price = (Integer) pozitie.get("price");
        String pozitieSezlong = (String) pozitie.get("pozitiaSezlong");

        // 🪑 Caută echipamentul după poziție (row-col) și plajă
        EchipamentPlaja echipament = echipamentPlajaRepository.findByPlajaIdAndPozitieLinieAndPozitieColoana(plajaId,row, col)
            .orElseThrow(() -> new RuntimeException("Echipamentul nu a fost găsit pentru poziția " + row + "-" + col));
        StareEchipamentPlaja stareEchipament = new StareEchipamentPlaja();
        stareEchipament.setId(3);
            echipament.setStareEchipament(stareEchipament);
            echipamentPlajaRepository.save(echipament);
        TipEchipamentPlaja tipEchipament = echipament.getTipEchipament();

        RezervareLinie linie = new RezervareLinie();
        linie.setEchipament(echipament);
        linie.setTipEchipament(tipEchipament);
        linie.setDataInceput(dataInceput);
        linie.setDataSfarsit(dataSfarsit);
        linie.setPretBucata(price);
        linie.setCantitate(1);
        linie.setPretCalculat(price);
        rezervare.addLinie(linie); // face și setRezervare()
    }
    boolean isNewRezervare = (rezervare.getId() == null);
            String stareVeche = null;
            
            if (!isNewRezervare) {
                // Pentru rezervări existente, salvează starea veche
                Optional<Rezervare> existing = getRezervareById(rezervare.getId());
                stareVeche = existing.map(Rezervare::getStareRezervare).orElse(null);
            }
            
          
            // Salvează rezervarea
            Rezervare savedRezervare = rezervareRepository.save(rezervare);
            
            // 🔔 Creează notificare
            if (isNewRezervare) {
                // Pentru rezervări noi
                createNotificationForNewRezervare(savedRezervare);
            } else if (stareVeche != null && !stareVeche.equals(savedRezervare.getStareRezervare())) {
                // Pentru schimbări de stare
                createNotificationForStateChange(savedRezervare, stareVeche, savedRezervare.getStareRezervare());
            }
            
            return savedRezervare;
            
}


    /**
     * 🆕 METODĂ NOUĂ: Salvează rezervare cu liniile dintr-un request complet
     */
    @Transactional
    public Rezervare saveRezervareCompleta(Rezervare rezervare, List<RezervareLinie> linii) {
        try {
            logger.info("💾 === SALVARE REZERVARE COMPLETĂ ===");
            logger.info("💾 Rezervare: {} | Linii: {}", rezervare.getCodRezervare(), linii.size());
            
            rezervare.setDataRezervare(LocalDate.now());
            rezervare.setStareRezervare(STARE_CONFIRMATA);  
            rezervare.setCodRezervare(generateCodRezervare());

            double sumaPlatita = 0.0;
            for(RezervareLinie linie : linii) {
                if (linie.getPretCalculat() != null) {
                    sumaPlatita += linie.getPretCalculat().doubleValue();
                }
            }
            rezervare.setSumaPlatita(sumaPlatita);

         
            // 1. Salvează rezervarea MAI ÎNTÂI
            Rezervare savedRezervare = saveRezervare(rezervare);
            logger.info("✅ Rezervare salvată cu ID: {} | Cod: {}", savedRezervare.getId(), savedRezervare.getCodRezervare());
            
            // 2. Șterge liniile existente dacă este o actualizare
            if (savedRezervare.getId() != null) {
                List<RezervareLinie> existingLinii = rezervareLinieRepository.findByRezervareId(savedRezervare.getId());
                if (!existingLinii.isEmpty()) {
                    rezervareLinieRepository.deleteAll(existingLinii);
                    logger.info("🗑️ Șterse {} linii existente pentru rezervarea {}", 
                               existingLinii.size(), savedRezervare.getCodRezervare());
                }
            }
            
            // 3. Salvează liniile noi INDIVIDUAL cu logging
            List<RezervareLinie> savedLinii = new ArrayList<>();
            int counter = 0;
            
            for (RezervareLinie linie : linii) {
                counter++;
                try {
                    // Setează rezervarea în linie
                    linie.setRezervare(savedRezervare);
                    
                    logger.info("💾 Salvez linia {}/{}: {} × {} = {} RON", 
                               counter, linii.size(), 
                               linie.getCantitate(), 
                               linie.getTipEchipamentNume(), 
                               linie.getPretCalculat());
                    
                    // Salvează linia
                    RezervareLinie savedLinie = rezervareLinieRepository.save(linie);
                    savedLinii.add(savedLinie);
                    
                    // Actualiză suma platită
                  


                    
                    
                    logger.info("✅ Linie salvată cu ID: {} | TipEchipament: {} | Echipament: {}", 
                               savedLinie.getId(), 
                               savedLinie.getTipEchipamentNume(),
                               savedLinie.getEchipamentNume());
                    
                } catch (Exception e) {
                    logger.error("❌ Eroare la salvarea liniei {}: {}", counter, linie, e);
                    // Continuă cu următoarea linie
                }
            }
            
            logger.info("✅ === REZERVARE COMPLETĂ SALVATĂ ===");
            logger.info("✅ Rezervare: {} cu {} linii salvate din {} trimise", 
                       savedRezervare.getCodRezervare(), savedLinii.size(), linii.size());
            
            // 5. 🔍 VERIFICARE FINALĂ
            List<RezervareLinie> verificareLinii = rezervareLinieRepository.findByRezervareId(savedRezervare.getId());
            logger.info("🔍 VERIFICARE: {} linii găsite în DB pentru rezervarea {}", 
                       verificareLinii.size(), savedRezervare.getId());
            
            return savedRezervare;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea rezervării complete", e);
            throw new RuntimeException("Eroare la salvarea rezervării complete: " + e.getMessage(), e);
        }
    }

    /**
     * 🔧 METODĂ HELPER: Obține liniile unei rezervări
     */
    public List<RezervareLinie> getLiniiByRezervareId(Integer rezervareId) {
        try {
            List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareId(rezervareId);
            logger.info("🔍 Găsite {} linii pentru rezervarea {}", linii.size(), rezervareId);
            return linii;
        } catch (Exception e) {
            logger.error("❌ Eroare la încărcarea liniilor pentru rezervarea {}", rezervareId, e);
            return new ArrayList<>();
        }
    }

    /**
     * 🆕 METODĂ NOUĂ: Anulează rezervare (fără verificare utilizator - pentru admin)
     */
    public boolean anulaRezervare(Integer rezervareId) {
        try {
            Optional<Rezervare> rezervareOpt = getRezervareById(rezervareId);
            
            if (!rezervareOpt.isPresent()) {
                logger.warn("⚠️ Tentativă de anulare pentru rezervarea inexistentă: {}", rezervareId);
                return false;
            }

            Rezervare rezervare = rezervareOpt.get();
            String stareVeche = rezervare.getStareRezervare();
            
            // Verifică dacă rezervarea poate fi anulată
            if (STARE_ANULATA.equalsIgnoreCase(stareVeche)) {
                logger.warn("⚠️ Rezervarea {} este deja anulată", rezervare.getCodRezervare());
                return false;
            }
            
            // Setează starea ca ANULATA
            rezervare.setStareRezervare(STARE_ANULATA);
            
            // Salvează rezervarea
            Rezervare savedRezervare = rezervareRepository.save(rezervare);
            
            // 🔔 Creează notificare anulare
            createNotificationForStateChange(savedRezervare, stareVeche, STARE_ANULATA);
            
            logger.info("❌ Rezervare anulată: {} (stare: {} -> {})", 
                       rezervare.getCodRezervare(), stareVeche, STARE_ANULATA);
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la anularea rezervării {}", rezervareId, e);
            return false;
        }
    }

    /**
     * 🆕 METODĂ NOUĂ: Confirmă rezervare
     */
    public boolean confirmaRezervare(Integer rezervareId) {
        return updateStareRezervare(rezervareId, STARE_CONFIRMATA);
    }

    /**
     * 🆕 METODĂ NOUĂ: Finalizează rezervare
     */
    public boolean finalizeazaRezervare(Integer rezervareId) {
        return updateStareRezervare(rezervareId, STARE_FINALIZATA);
    }

    /**
     * 🆕 METODĂ NOUĂ: Găsește rezervări după stare cu liniile incluse
     */
    public List<Rezervare> getRezervariByStare(String stare) {
        List<Rezervare> rezervari = rezervareRepository.findByStareRezervareIgnoreCase(stare);
        
        // Încarcă liniile pentru fiecare rezervare
        for (Rezervare rezervare : rezervari) {
            List<RezervareLinie> linii = rezervareLinieRepository.findByRezervareId(rezervare.getId());
            // Setează liniile dacă ai această metodă în Rezervare
            // rezervare.setLinii(linii);
        }
        
        return rezervari;
    }

    /**
     * 🆕 METODĂ NOUĂ: Salvează o linie de rezervare
     */
    public RezervareLinie saveRezervareLinie(RezervareLinie linie) {
        try {
            return rezervareLinieRepository.save(linie);
        } catch (Exception e) {
            logger.error("❌ Eroare la salvarea liniei de rezervare: {}", linie, e);
            throw new RuntimeException("Eroare la salvarea liniei de rezervare", e);
        }
    }

    // ==================== METODE HELPER ====================

    /**
     * Verifică dacă o rezervare poate fi anulată
     */
    private boolean canCancelRezervare(Rezervare rezervare) {
        String stare = rezervare.getStareRezervare();
        // Rezervarea poate fi anulată doar dacă nu este deja anulată sau finalizată
        return !STARE_ANULATA.equalsIgnoreCase(stare) && !STARE_FINALIZATA.equalsIgnoreCase(stare);
    }

    /**
     * Verifică dacă o rezervare poate fi modificată
     */
    private boolean canModifyRezervare(Rezervare rezervare) {
        String stare = rezervare.getStareRezervare();
        // Rezervarea poate fi modificată doar dacă este în stare PENDING sau CONFIRMATA
        return STARE_PENDING.equalsIgnoreCase(stare) || STARE_CONFIRMATA.equalsIgnoreCase(stare);
    }

    // Setează câmpurile pentru rezervare nouă
    private void setupNewRezervare(Rezervare rezervare) {
        // 1. Generează cod rezervare dacă nu există
        if (rezervare.getCodRezervare() == null || rezervare.getCodRezervare().isEmpty()) {
            rezervare.setCodRezervare(generateCodRezervare());
        }
        
        // 2. Setează data de creare
        if (rezervare.getCreatedAt() == null) {
            rezervare.setCreatedAt(LocalDateTime.now());
        }
        
        // 3. Verifică că starea este setată
        if (rezervare.getStareRezervare() == null || rezervare.getStareRezervare().trim().isEmpty()) {
            rezervare.setStareRezervare(STARE_CONFIRMATA);
            logger.info("ℹ️ Stare default setată la {} pentru rezervarea nouă", STARE_CONFIRMATA);
        }
        
        // 4. 🔧 FIX CRUCIAL: NU suprascrie numele plajei dacă este deja setat
       
    }

    // Actualizează starea unei rezervări
    private boolean updateStareRezervare(Integer rezervareId, String stareNoua) {
        try {
            Optional<Rezervare> rezervareOpt = getRezervareById(rezervareId);
            
            if (!rezervareOpt.isPresent()) {
                logger.warn("⚠️ Rezervarea cu ID {} nu există", rezervareId);
                return false;
            }

            Rezervare rezervare = rezervareOpt.get();
            String stareVeche = rezervare.getStareRezervare();
            
            if (stareNoua.equalsIgnoreCase(stareVeche)) {
                logger.info("ℹ️ Rezervarea {} are deja starea {}", rezervare.getCodRezervare(), stareNoua);
                return true;
            }
            
            rezervare.setStareRezervare(stareNoua);
            Rezervare savedRezervare = rezervareRepository.save(rezervare);
            
            // Creează notificare pentru schimbarea stării
            createNotificationForStateChange(savedRezervare, stareVeche, stareNoua);
            
            logger.info("🔄 Stare actualizată pentru rezervarea {}: {} -> {}", 
                       rezervare.getCodRezervare(), stareVeche, stareNoua);
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la actualizarea stării rezervării {} la {}", rezervareId, stareNoua, e);
            return false;
        }
    }

    // Generează cod unic pentru rezervare
    private String generateCodRezervare() {
        String prefix = "RZ";
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7); // Ultimele 6 cifre
        int random = (int)(Math.random() * 1000);
        return prefix + timestamp + String.format("%03d", random);
    }

    private void createNotificationForNewRezervare(Rezervare rezervare) {
        try {
            if (rezervare.getUtilizator() != null) {
                Long utilizatorId = rezervare.getUtilizator().getId();
                String codRezervare = rezervare.getCodRezervare();
                
                String mesaj = String.format("✅ Rezervarea %s a fost confirmată cu succes!\n📅 Data: %s\n💰 Suma: %.2f RON",
                    codRezervare,
                    
                    rezervare.getDataRezervare() != null ? rezervare.getDataRezervare().toString() : "A fi confirmată",
                    
                    rezervare.getSumaPlatita() != null ? rezervare.getSumaPlatita() : 0.0);
                
                notificareService.createSystemNotification(rezervare,utilizatorId, mesaj);
                
                logger.info("🔔 Notificare creată pentru rezervarea {} (utilizator: {})", 
                           codRezervare, utilizatorId);
            } else {
                logger.warn("⚠️ Nu s-a putut crea notificare - rezervarea nu are utilizator setat");
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la crearea notificării pentru rezervarea {}", 
                        rezervare.getCodRezervare(), e);
        }
    }

    // Creează notificare pentru schimbarea stării
    private void createNotificationForStateChange(Rezervare rezervare, String stareVeche, String stareNoua) {
        try {
            if (rezervare.getUtilizator() != null) {
                Long utilizatorId = rezervare.getUtilizator().getId();
                String codRezervare = rezervare.getCodRezervare();
                
                String mesaj;
                switch (stareNoua.toUpperCase()) {
                    case STARE_CONFIRMATA:
                        mesaj = String.format("✅ Rezervarea %s a fost confirmată!\n\n📍 %s\n📅 %s\n🏖️ %s", 
                                             codRezervare, rezervare.getDataRezervare());
                        break;
                    case STARE_ANULATA:
                        mesaj = String.format("❌ Rezervarea %s a fost anulată.\n\n📍 %s\n📅 %s", 
                                             codRezervare, rezervare.getDataRezervare());
                        break;
                    case STARE_FINALIZATA:
                        mesaj = String.format("✅ Rezervarea %s a fost finalizată cu succes!\n\n📍 %s\n📅 %s\n\nMulțumim pentru încredere!", 
                                             codRezervare,  rezervare.getDataRezervare());
                        break;
                    default:
                        mesaj = String.format("🔄 Starea rezervării %s a fost schimbată din %s în %s\n\n📍 %s\n📅 %s", 
                                             codRezervare, stareVeche, stareNoua, rezervare.getDataRezervare());
                }
                
                notificareService.createSystemNotification(rezervare,utilizatorId, mesaj);
                
                logger.info("🔔 Notificare schimbare stare: {} ({} -> {})", 
                           codRezervare, stareVeche, stareNoua);
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la crearea notificării pentru schimbarea stării rezervării {}", 
                        rezervare.getCodRezervare(), e);
        }
    }

    public List<String> getReservedPositions(LocalDate dataInceput, LocalDate dataSfarsit, Long plajaId) {
        return rezervareRepository.findReservedPositions(dataInceput, dataSfarsit, plajaId);
    }


//     @Query("SELECT new com.example.fullstacktemplate.dto.RezervareAdminDto(" +
//     "r.id, " +
//     "r.codRezervare, " +
//     "r.createdAt, " +
//     "r.dataRezervare, " +
//     "r.stareRezervare, " +
//     "u.name, " +
//     "u.email, " +
//     "p.denumire, " +
//     "SUM(CAST(rl.cantitate AS java.lang.Long)), " +  // Suma cantităților
//     "SUM(rl.pretCalculat)) " + // Suma prețurilor
//     "FROM Rezervare r " +
//     "JOIN r.utilizator u " +
//     "LEFT JOIN r.linii rl " + // 'linii' este numele câmpului List<RezervareLinie> din entitatea Rezervare
//     "LEFT JOIN rl.echipament e " +
//     "LEFT JOIN e.plaja p " +
//     "GROUP BY r.id, u.name, u.email, p.denumire " +
//     "ORDER BY r.createdAt DESC")
// List<RezervareAdminDto> findAllAdminReservations();
// }
}

