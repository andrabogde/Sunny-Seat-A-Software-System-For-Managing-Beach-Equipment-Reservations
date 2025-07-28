package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.model.RezervareLinie;
import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import com.example.fullstacktemplate.dto.RezervareResponseDTO;
import com.example.fullstacktemplate.model.EchipamentPlaja;
import com.example.fullstacktemplate.service.RezervareService;
import com.example.fullstacktemplate.service.TipEchipamentPlajaService;
import com.example.fullstacktemplate.service.EchipamentPlajaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rezervari")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
public class RezervareController {

    private static final Logger logger = LoggerFactory.getLogger(RezervareController.class);

    @Autowired
    private RezervareService rezervareService;

    // 🆕 SERVICII PENTRU ÎNCĂRCAREA ENTITĂȚILOR
    @Autowired
    private TipEchipamentPlajaService tipEchipamentPlajaService;

    @Autowired
    private EchipamentPlajaService echipamentPlajaService;

    // Metodele existente
    @GetMapping
    public List<RezervareResponseDTO> getAllRezervari() {
        return rezervareService.getAllRezervariDTO();
    }

    // 🔄 ACTUALIZAT: Rezervările utilizatorului curent cu detalii complete și linii
   @GetMapping("/user")
public ResponseEntity<?> getRezervariUtilizator(Principal principal, Authentication auth) {
    try {
        // Obține email-ul utilizatorului din token/sesiune
        String username = principal.getName();
        logger.info("🔍 Căutare rezervări pentru utilizatorul: {}", username);
        
        // 🔧 ÎNCERCĂ MAI ÎNTÂI METODA SIMPLĂ
        List<Rezervare> rezervari = rezervareService.getRezervariByUtilizatorEmail(username);
        logger.info("✅ Găsite {} rezervări raw pentru {}", rezervari.size(), username);
        
        // 🔧 CONVERTEȘTE MANUAL ÎN FORMAT SIMPLIFICAT
        List<Map<String, Object>> rezultat = new ArrayList<>();
        
        String numePlaja;
        String imageUrl;

        for (Rezervare rezervare : rezervari) {
            numePlaja=null;
            imageUrl=null;
            Map<String, Object> rezervareMap = new HashMap<>();
            
            // Date de bază
            rezervareMap.put("id", rezervare.getId());
            rezervareMap.put("codRezervare", rezervare.getCodRezervare());
           
            rezervareMap.put("sumaPlatita", rezervare.getSumaPlatita());
            rezervareMap.put("stareRezervare", rezervare.getStareRezervare());
            rezervareMap.put("dataRezervare", rezervare.getDataRezervare());
            rezervareMap.put("createdAt", rezervare.getCreatedAt());
            
            // 🔧 CAUTĂ LINIILE MANUAL
            try {
                List<RezervareLinie> linii = rezervareService.getLiniiByRezervareId(rezervare.getId());
                logger.info("🔍 Găsite {} linii pentru rezervarea {}", linii.size(), rezervare.getCodRezervare());
                
                if (!linii.isEmpty()) {
                    numePlaja = linii.get(0).getEchipament().getPlaja().getDenumire();
                    Map<String, Object> detaliiWeb = linii.get(0).getEchipament().getPlaja().getDetaliiWeb();
                    if(detaliiWeb.containsKey("photos")){
                        List<String> photos=(List<String>) detaliiWeb.get("photos");
                        if(!photos.isEmpty()){
                            imageUrl=photos.get(0);
                        }
                    }
                    // Calculează date din linii
                    int totalCantitate = linii.stream().mapToInt(RezervareLinie::getCantitate).sum();
                    double totalCalculat = linii.stream().mapToDouble(l -> l.getPretCalculat().doubleValue()).sum();
                    
                    rezervareMap.put("cantitate", totalCantitate);
                    rezervareMap.put("pretCalculat", totalCalculat);
                    rezervareMap.put("numarLinii", linii.size());
                    
                    // Prima linie pentru date comune
                    RezervareLinie primaLinie = linii.get(0);
                    rezervareMap.put("dataInceput", primaLinie.getDataInceput());
                    rezervareMap.put("dataSfarsit", primaLinie.getDataSfarsit());
                    rezervareMap.put("pretBucata", primaLinie.getPretBucata());
                    rezervareMap.put("tipEchipament", primaLinie.getTipEchipamentNume());
                    
                    // Linii detaliate
                    List<Map<String, Object>> liniiDetalii = new ArrayList<>();
                    for (RezervareLinie linie : linii) {
                        Map<String, Object> linieMap = new HashMap<>();
                        linieMap.put("cantitate", linie.getCantitate());
                        linieMap.put("dataInceput", linie.getDataInceput());
                        linieMap.put("dataSfarsit", linie.getDataSfarsit());
                        linieMap.put("pretBucata", linie.getPretBucata());
                        linieMap.put("pretCalculat", linie.getPretCalculat());
                        linieMap.put("tipEchipament", linie.getTipEchipamentNume());
                        linieMap.put("echipament", linie.getEchipamentNume());
                        liniiDetalii.add(linieMap);
                    }
                    rezervareMap.put("liniiDetalii", liniiDetalii);
                } else {
                    // Valori default pentru rezervări fără linii
                    rezervareMap.put("cantitate", 0);
                    rezervareMap.put("pretCalculat", rezervare.getSumaPlatita() != null ? rezervare.getSumaPlatita() : 0.0);
                    rezervareMap.put("numarLinii", 0);
                    rezervareMap.put("dataInceput", rezervare.getDataRezervare());
                    rezervareMap.put("dataSfarsit", rezervare.getDataRezervare());
                    rezervareMap.put("pretBucata", 0);
                    rezervareMap.put("tipEchipament", "Nespecificat");
                    rezervareMap.put("liniiDetalii", new ArrayList<>());
                }
            } catch (Exception e) {
                logger.error("❌ Eroare la încărcarea liniilor pentru rezervarea {}", rezervare.getId(), e);
                // Setează valori default în caz de eroare
                rezervareMap.put("cantitate", 0);
                rezervareMap.put("numarLinii", 0);
                rezervareMap.put("liniiDetalii", new ArrayList<>());
            }
            rezervareMap.put("numePlaja", numePlaja);
            rezervareMap.put("imageUrl", imageUrl);
            rezultat.add(rezervareMap);
            logger.info("✅ Rezervare procesată: {} cu {} linii", rezervare.getCodRezervare(), 
                       (Integer) rezervareMap.get("numarLinii"));
        }
        
        logger.info("✅ Returnez {} rezervări procesate pentru {}", rezultat.size(), username);
        return ResponseEntity.ok(rezultat);
        
    } catch (Exception e) {
        logger.error("❌ Eroare la încărcarea rezervărilor pentru utilizator", e);
        
        // 🔧 RETURNEAZĂ UN JSON DE EROARE, NU HTML
        return ResponseEntity.status(500).body(Map.of(
            "error", true,
            "message", "Eroare la încărcarea rezervărilor: " + e.getMessage(),
            "details", e.getClass().getSimpleName()
        ));
    }
}

    // 🆕 ENDPOINT NOU: Rezervările utilizatorului în format complet (cu liniile încărcate)
    @GetMapping("/user/complete")
    public ResponseEntity<List<Rezervare>> getRezervariUtilizatorComplete(Principal principal) {
        try {
            String username = principal.getName();
            logger.info("🔍 Căutare rezervări complete pentru utilizatorul: {}", username);
            
            List<Rezervare> rezervari = rezervareService.getRezervariByUtilizatorEmail(username);
            
            logger.info("✅ Găsite {} rezervări complete pentru {}", rezervari.size(), username);
            return ResponseEntity.ok(rezervari);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la încărcarea rezervărilor complete pentru utilizator", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔄 ACTUALIZAT: Detaliile unei rezervări specifice cu liniile incluse
    @GetMapping("/{id}/detalii")
    public ResponseEntity<Map<String, Object>> getRezervareDetalii(@PathVariable Integer id, Principal principal) {
        try {
            String username = principal.getName();
            Map<String, Object> detalii = rezervareService.getRezervareDetaliiComplete(id, username);
            
            if (detalii != null) {
                return ResponseEntity.ok(detalii);
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la încărcarea detaliilor rezervării {}", id, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rezervare> getRezervareById(@PathVariable Integer id) {
        return rezervareService.getRezervareById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔄 ACTUALIZAT: Creare rezervare cu suport pentru linii și setarea utilizatorului
    @PostMapping
    public ResponseEntity<?> createRezervare(@RequestBody Map<String, Object> requestBody, Principal principal) {
        try {
            String username = principal.getName(); // Email-ul utilizatorului autentificat
            
            // Extrage rezervarea din request
            Rezervare rezervare = extractRezervareFromRequest(requestBody);
            
            // Extrage liniile din request (dacă există)
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> liniiData = (List<Map<String, Object>>) requestBody.get("linii");
            
            Rezervare savedRezervare;
            
            if (liniiData != null && !liniiData.isEmpty()) {
                // Dacă sunt linii, folosește metoda completă
                List<RezervareLinie> linii = extractLiniiFromRequest(liniiData);
                
                // Setează utilizatorul în rezervare
                rezervare = setUtilizatorInRezervare(rezervare, username);
                
                savedRezervare = rezervareService.saveRezervareCompleta(rezervare, linii);
                logger.info("✅ Rezervare cu {} linii creată cu codul: {} pentru utilizatorul {}", 
                           linii.size(), savedRezervare.getCodRezervare(), username);
            } else {
                // Dacă nu sunt linii, folosește metoda cu utilizator
                savedRezervare = rezervareService.saveRezervareWithUser(rezervare, username);
                logger.info("✅ Rezervare simplă creată cu codul: {} pentru utilizatorul {}", 
                           savedRezervare.getCodRezervare(), username);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Rezervare confirmată cu succes!",
                "codRezervare", savedRezervare.getCodRezervare(),
                "rezervareId", savedRezervare.getId(),
                "rezervare", savedRezervare
            ));
            
        } catch (Exception e) {
            logger.error("❌ Eroare la crearea rezervării", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Eroare la crearea rezervării: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rezervare> updateRezervare(
            @PathVariable Integer id, @RequestBody Rezervare updatedRezervare) {
        return rezervareService.getRezervareById(id)
                .map(existingRezervare -> {
                    updatedRezervare.setId(id);
                    return ResponseEntity.ok(rezervareService.saveRezervare(updatedRezervare));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔄 ACTUALIZAT: Anulare rezervare cu verificare utilizator
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRezervare(@PathVariable Integer id, Principal principal) {
        try {
            String username = principal.getName();
            boolean success = rezervareService.anulareRezervareUtilizator(id, username);
            
            if (success) {
                logger.info("❌ Rezervare anulată cu ID: {} de către {}", id, username);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Rezervarea a fost anulată cu succes!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nu s-a putut anula rezervarea sau nu aveți permisiunea"
                ));
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la anularea rezervării {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Eroare la anularea rezervării: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}/anuleaza")
    public ResponseEntity<?> anulaRezervare(@PathVariable Integer id, Principal principal) {
        try {
            String username = principal.getName();
            boolean success = rezervareService.anulareRezervareUtilizator(id, username);
            
            if (success) {
                logger.info("❌ Rezervare anulată cu ID: {} de către {}", id, username);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Rezervare anulată cu succes!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nu s-a putut anula rezervarea"
                ));
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la anularea rezervării {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Eroare la anularea rezervării: " + e.getMessage()
            ));
        }
    }

    

    // 🆕 ENDPOINT NOU: Confirmă rezervare (pentru admin)
    @PutMapping("/{id}/confirma")
    public ResponseEntity<?> confirmaRezervare(@PathVariable Integer id) {
        try {
            boolean success = rezervareService.confirmaRezervare(id);
            
            if (success) {
                logger.info("✅ Rezervare confirmată cu ID: {}", id);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Rezervare confirmată cu succes!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nu s-a putut confirma rezervarea"
                ));
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la confirmarea rezervării {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Eroare la confirmarea rezervării: " + e.getMessage()
            ));
        }
    }

    // 🆕 ENDPOINT NOU: Finalizează rezervare (pentru admin)
    @PutMapping("/{id}/finalizeaza")
    public ResponseEntity<?> finalizeazaRezervare(@PathVariable Integer id) {
        try {
            boolean success = rezervareService.finalizeazaRezervare(id);
            
            if (success) {
                logger.info("🏁 Rezervare finalizată cu ID: {}", id);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Rezervare finalizată cu succes!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nu s-a putut finaliza rezervarea"
                ));
            }
            
        } catch (Exception e) {
            logger.error("❌ Eroare la finalizarea rezervării {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Eroare la finalizarea rezervării: " + e.getMessage()
            ));
        }
    }

    // 🆕 ENDPOINT NOU: Găsește rezervări după stare
    @GetMapping("/stare/{stare}")
    public ResponseEntity<List<Rezervare>> getRezervariByStare(@PathVariable String stare) {
        try {
            List<Rezervare> rezervari = rezervareService.getRezervariByStare(stare);
            logger.info("🔍 Găsite {} rezervări cu starea {}", rezervari.size(), stare);
            return ResponseEntity.ok(rezervari);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la căutarea rezervărilor cu starea {}", stare, e);
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== METODE HELPER ====================

    /**
     * Extrage obiectul Rezervare din request body
     */
    private Rezervare extractRezervareFromRequest(Map<String, Object> requestBody) {
        Rezervare rezervare = new Rezervare();
        
        // Mapează câmpurile din request la obiectul Rezervare
        // if (requestBody.containsKey("codRezervare")) {
        //     rezervare.setCodRezervare((String) requestBody.get("codRezervare"));
        // }
        // if (requestBody.containsKey("stareRezervare")) {
        //     rezervare.setStareRezervare((String) requestBody.get("stareRezervare"));
        // }
        // if (requestBody.containsKey("numePlaja")) {
        //     rezervare.setNumePlaja((String) requestBody.get("numePlaja"));
        // }
        // if (requestBody.containsKey("pozitiaSezlong")) {
        //     rezervare.setPozitiaSezlong((String) requestBody.get("pozitiaSezlong"));
        // }
        // if (requestBody.containsKey("sumaPlatita")) {
        //     Object suma = requestBody.get("sumaPlatita");
        //     if (suma instanceof Number) {
        //         rezervare.setSumaPlatita(((Number) suma).doubleValue());
        //     }
        // }
        // if (requestBody.containsKey("stripePaymentIntentId")) {
        //     rezervare.setStripePaymentIntentId((String) requestBody.get("stripePaymentIntentId"));
        // }
        // if (requestBody.containsKey("dataRezervare")) {
        //     // Aici ar trebui să parseezi data din string, depinde de formatul folosit
        //     String dataStr = (String) requestBody.get("dataRezervare");
        //     if (dataStr != null && !dataStr.isEmpty()) {
        //         try {
        //             rezervare.setDataRezervare(java.time.LocalDate.parse(dataStr));
        //         } catch (Exception e) {
        //             logger.warn("⚠️ Nu s-a putut parsa data rezervării: {}", dataStr);
        //         }
        //     }
        // }
        
        // Setează utilizatorul (va fi setat în service bazat pe authentication)
        // rezervare.setUtilizator() - va fi setat în service
        
        return rezervare;
    }

    /**
     * Extrage lista de RezervareLinie din request body
     */
    private List<RezervareLinie> extractLiniiFromRequest(List<Map<String, Object>> liniiData) {
        List<RezervareLinie> linii = new ArrayList<>();
        
        for (Map<String, Object> linieData : liniiData) {
            RezervareLinie linie = new RezervareLinie();
            
            // Mapează câmpurile pentru fiecare linie
            if (linieData.containsKey("cantitate")) {
                Object cantitate = linieData.get("cantitate");
                if (cantitate instanceof Number) {
                    linie.setCantitate(((Number) cantitate).intValue());
                }
            }
            
            if (linieData.containsKey("pretBucata")) {
                Object pret = linieData.get("pretBucata");
                if (pret instanceof Number) {
                    linie.setPretBucata(((Number) pret).intValue());
                }
            }
            
            if (linieData.containsKey("pretCalculat")) {
                Object pretCalculat = linieData.get("pretCalculat");
                if (pretCalculat instanceof Number) {
                    linie.setPretCalculat(((Number) pretCalculat).intValue());
                }
            }
            
            // Parse date
            if (linieData.containsKey("dataInceput")) {
                String dataStr = (String) linieData.get("dataInceput");
                if (dataStr != null && !dataStr.isEmpty()) {
                    try {
                        linie.setDataInceput(java.time.LocalDate.parse(dataStr));
                    } catch (Exception e) {
                        logger.warn("⚠️ Nu s-a putut parsa data de început: {}", dataStr);
                    }
                }
            }
            
            if (linieData.containsKey("dataSfarsit")) {
                String dataStr = (String) linieData.get("dataSfarsit");
                if (dataStr != null && !dataStr.isEmpty()) {
                    try {
                        linie.setDataSfarsit(java.time.LocalDate.parse(dataStr));
                    } catch (Exception e) {
                        logger.warn("⚠️ Nu s-a putut parsa data de sfârșit: {}", dataStr);
                    }
                }
            }
            
            // Pentru relațiile cu alte entități (TipEchipamentPlaja, EchipamentPlaja),
            // încarcă entitățile din baza de date bazat pe ID-urile primite
            if (linieData.containsKey("tipEchipamentId")) {
                Object tipEchipamentId = linieData.get("tipEchipamentId");
                if (tipEchipamentId instanceof Number) {
                    try {
                        Integer tipId = ((Number) tipEchipamentId).intValue();
                        TipEchipamentPlaja tipEchipament = tipEchipamentPlajaService.getTipEchipamentById(tipId)
                                .orElse(null);
                        if (tipEchipament != null) {
                            linie.setTipEchipament(tipEchipament);
                            logger.info("📋 TipEchipament încărcat: ID={}, Nume={}", tipId, tipEchipament.getDenumire());
                        } else {
                            logger.warn("⚠️ TipEchipament cu ID={} nu a fost găsit", tipId);
                        }
                    } catch (Exception e) {
                        logger.error("❌ Eroare la încărcarea TipEchipament cu ID={}", tipEchipamentId, e);
                    }
                }
            }
            
            if (linieData.containsKey("echipamentId")) {
                Object echipamentId = linieData.get("echipamentId");
                if (echipamentId instanceof Number) {
                    try {
                        Integer echipId = ((Number) echipamentId).intValue();
                        EchipamentPlaja echipament = echipamentPlajaService.getEchipamentPlajaById(echipId)
                                .orElse(null);
                        if (echipament != null) {
                            linie.setEchipament(echipament);
                            logger.info("🏖️ Echipament încărcat: ID={}, Nume={}", echipId, echipament.getDenumire());
                        } else {
                            logger.warn("⚠️ Echipament cu ID={} nu a fost găsit", echipId);
                        }
                    } catch (Exception e) {
                        logger.error("❌ Eroare la încărcarea Echipament cu ID={}", echipamentId, e);
                    }
                }
            }
            
            linii.add(linie);
        }
        
        return linii;
    }

    /**
     * Setează utilizatorul în rezervare bazat pe email-ul din authentication
     */
    private Rezervare setUtilizatorInRezervare(Rezervare rezervare, String userEmail) {
        try {
            // Aici ar trebui să ai un UserService pentru a găsi utilizatorul
            // User utilizator = userService.getUserByEmail(userEmail).orElse(null);
            // rezervare.setUtilizator(utilizator);
            
            // Pentru moment, lasă service-ul să se ocupe de setarea utilizatorului
            logger.info("📧 Utilizator setat pentru rezervare: {}", userEmail);
            return rezervare;
        } catch (Exception e) {
            logger.error("❌ Eroare la setarea utilizatorului pentru rezervare", e);
            throw new RuntimeException("Eroare la setarea utilizatorului", e);
        }
    }

      @GetMapping("/pozitii-rezervate")
    public ResponseEntity<List<String>> getReservedPositions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInceput,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataSfarsit,
            @RequestParam Long plajaId) {
        
        try {
            List<String> pozitiiRezervate = rezervareService.getReservedPositions(
                dataInceput, dataSfarsit, plajaId);
            return ResponseEntity.ok(pozitiiRezervate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}