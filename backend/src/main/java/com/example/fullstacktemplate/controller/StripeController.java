package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.example.fullstacktemplate.service.RezervareService;
import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.model.RezervareLinie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000", "http://localhost:5173"})
public class StripeController {

    private static final Logger logger = LoggerFactory.getLogger(StripeController.class);

    @Autowired
    private StripeService stripeService;

    @Value("${stripe.secret.key}")
private String stripeSecretKey;


    @Autowired
    private RezervareService rezervareService;

    // ==================== METODELE EXISTENTE ====================

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
            Long amount = ((Number) data.get("amount")).longValue();
            String currency = (String) data.get("currency");
            
            String clientSecret = stripeService.createPaymentIntent(amount, currency);
            
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
        } catch (Exception e) {
            logger.error("❌ Eroare la crearea PaymentIntent", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getStripeConfig() {
        return ResponseEntity.ok(Map.of(
            "publicKey", stripeService.getStripePublicKey()
        ));
    }

    // ==================== 🆕 ENDPOINT NOU PENTRU RESERVATION FORM ====================

    /**
     * 🆕 ENDPOINT SPECIAL: Pentru rezervările din ReservationForm
     */
    @PostMapping("/confirm-reservation-form-payment")
    public ResponseEntity<Map<String, Object>> confirmReservationFormPayment(@RequestBody Map<String, Object> data) {
        try {
            logger.info("🔵 === CONFIRMARE PLATĂ DIN RESERVATION FORM ===");
            logger.info("🔵 Date primite: {}", data);
            
            String paymentIntentId = (String) data.get("paymentIntentId");
            @SuppressWarnings("unchecked")
            Map<String, Object> reservationData = (Map<String, Object>) data.get("reservationData");
            
            if (paymentIntentId == null || reservationData == null) {
                throw new Exception("PaymentIntentId sau reservationData lipsesc");
            }
            
            // Folosește metoda specifică pentru formularul de rezervare
            Map<String, Object> result = stripeService.processReservationFormPayment(paymentIntentId, reservationData);
            
            logger.info("✅ Rezervare din form procesată cu succes");
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la confirmarea plății din form", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Eroare la procesarea rezervării: " + e.getMessage(),
                "details", e.getClass().getSimpleName()
            ));
        }
    }


     @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> request) {
        try {
            // Setează cheia Stripe
            Stripe.apiKey = stripeService.getStripeSecretKey();

            // Extrage datele din request
            String paymentIntentId = (String) request.get("paymentIntentId");
            Map<String, Object> reservationData = (Map<String, Object>) request.get("reservationData");

            // Validare
            if (paymentIntentId == null || paymentIntentId.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "PaymentIntent ID is required"));
         }

            if (reservationData == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Reservation data is required"));
            }

            // 🔍 Verifică starea PaymentIntent în Stripe
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            
            if (!"succeeded".equals(intent.getStatus())) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "success", false,
                        "error", "Payment not completed. Status: " + intent.getStatus()
                    ));
            }

            // 💾 Salvează rezervarea în baza de date
          

            // Salvează în baza de date
            Rezervare savedRezervare = rezervareService.createRezervareFromRequest(reservationData,paymentIntentId);
           // RezervarePlaja savedRezervare = rezervareService.saveReservation(rezervare);

            // 📧 Trimite email de confirmare (opțional)
            try {
                // emailService.sendConfirmationEmail(savedRezervare);
                System.out.println("📧 Email confirmation sent for: " + savedRezervare.getCodRezervare());
            } catch (Exception e) {
                System.err.println("⚠️ Email sending failed: " + e.getMessage());
                // Nu bloca procesul dacă email-ul nu merge
            }

            // 🎉 Returnează succesul
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("codRezervare", savedRezervare.getCodRezervare());
            response.put("rezervareId", savedRezervare.getId());
            response.put("stareRezervare", "confirmed");
            response.put("message", "Rezervarea a fost confirmată cu succes!");
            response.put("paymentIntentId", paymentIntentId);
            response.put("amount", intent.getAmount());

            System.out.println("✅ Reservation confirmed: " + savedRezervare.getCodRezervare() + " for PaymentIntent: " + paymentIntentId);
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            System.err.println("❌ Stripe error: " + e.getMessage());
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "error", "Stripe verification failed: " + e.getMessage()
                ));
        } catch (Exception e) {
            System.err.println("❌ General error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "error", "Server error: " + e.getMessage()
                ));
        }
    }
    

    // ==================== ENDPOINT-URI DE TEST ACTUALIZATE ====================

    /**
     * 🧪 ENDPOINT DE TEST: Testează rezervarea din formular
     */
    @PostMapping("/test-reservation-form")
    public ResponseEntity<Map<String, Object>> testReservationForm(@RequestBody Map<String, Object> testData) {
        try {
            logger.info("🧪 === TEST REZERVARE DIN FORMULAR ===");
            logger.info("🧪 Date primite pentru test: {}", testData);
            
            // Simulează o plată de succes
            String fakePaymentIntentId = "pi_test_form_" + System.currentTimeMillis();
            
            // Date de test simulate din ReservationForm
            Map<String, Object> mockFormData = new HashMap<>();
            mockFormData.put("utilizatorId", 15L);
            mockFormData.put("utilizatorEmail", "andrabogde@yahoo.com");
            mockFormData.put("numePlaja", "Play Beach, Mamaia - Test Formular");
            mockFormData.put("dataRezervare", "2025-06-25");
            mockFormData.put("dataSfarsit", "2025-06-27");
            mockFormData.put("sumaPlatita", 195.0);
            mockFormData.put("pozitiaSezlong", "Primul rând - 2 Șezlonguri + 1 Umbrele");
            
            // Simulează datele din originalFormData (din ReservationForm)
            Map<String, Object> originalFormData = new HashMap<>();
            originalFormData.put("nrSezlonguri", 2);
            originalFormData.put("nrUmbrele", 1);
            originalFormData.put("pozitie", "fata");
            
            Map<String, Object> pret = new HashMap<>();
            pret.put("pretSezlong", 50);
            pret.put("pretUmbrela", 30);
            pret.put("taxaRezervare", 15);
            originalFormData.put("pret", pret);
            
            mockFormData.put("originalFormData", originalFormData);
            mockFormData.put("nrSezlonguri", 2);
            mockFormData.put("nrUmbrele", 1);
            mockFormData.put("pretSezlong", 50);
            mockFormData.put("pretUmbrela", 30);
            
            logger.info("🧪 Apelez StripeService.processReservationFormPayment cu date de test...");
            
            // Apelează metoda de salvare din formular
            Map<String, Object> result = stripeService.processReservationFormPayment(fakePaymentIntentId, mockFormData);
            
            logger.info("✅ Test rezervare din formular completat cu succes: {}", result);
            
            // Adaugă info despre verificarea în DB
            Map<String, Object> extendedResult = new HashMap<>(result);
            extendedResult.put("testMode", true);
            extendedResult.put("testType", "ReservationForm");
            extendedResult.put("message", "✅ Rezervare de test din formular creată cu succes! Verifică în 'Rezervările Mele'.");
            extendedResult.put("debugInfo", Map.of(
                "paymentIntentId", fakePaymentIntentId,
                "nrSezlonguri", 2,
                "nrUmbrele", 1,
                "utilizatorEmail", "andrabogde@yahoo.com"
            ));
            
            return ResponseEntity.ok(extendedResult);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la testul rezervării din formular", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Eroare la testul rezervării din formular: " + e.getMessage(),
                "details", e.getClass().getSimpleName(),
                "stackTrace", Arrays.toString(e.getStackTrace()).substring(0, Math.min(500, Arrays.toString(e.getStackTrace()).length()))
            ));
        }
    }

    /**
     * 🧪 ENDPOINT DE TEST: Testează direct salvarea unei rezervări cu linii (metoda veche)
     */
    @PostMapping("/test-rezervare-cu-linii")
    public ResponseEntity<Map<String, Object>> testRezervareCompleta(@RequestBody Map<String, Object> testData) {
        try {
            logger.info("🧪 === TEST SALVARE REZERVARE CU LINII (METODA VECHE) ===");
            logger.info("🧪 Date primite pentru test: {}", testData);
            
            // Simulează o plată de succes
            String fakePaymentIntentId = "pi_test_" + System.currentTimeMillis();
            
            // Date de test pentru rezervare cu linii - METODA VECHE
            Map<String, Object> mockReservationData = new HashMap<>();
            mockReservationData.put("utilizatorId", 15L);
            mockReservationData.put("utilizatorEmail", "andrabogde@yahoo.com");
            mockReservationData.put("numePlaja", "Test Beach cu Linii - Metoda Veche");
            mockReservationData.put("dataRezervare", "2025-06-25");
            mockReservationData.put("dataSfarsit", "2025-06-27");
            mockReservationData.put("sumaPlatita", 150.0);
            mockReservationData.put("pozitiaSezlong", "R2C5-SEZLONG, R2C7-SEZLONG");
            
            // Poziții selectate cu linii - METODA VECHE
            List<Map<String, Object>> pozitiiSelectate = Arrays.asList(
                Map.of(
                    "row", 1,
                    "col", 4,
                    "type", "sezlong",
                    "price", 25
                ),
                Map.of(
                    "row", 1,
                    "col", 6,
                    "type", "sezlong", 
                    "price", 25
                )
            );
            
            mockReservationData.put("pozitiiSelectate", pozitiiSelectate);
            mockReservationData.put("forceCustomPosition", true);
            
            logger.info("🧪 NOTĂ: Acest test folosește metoda veche care nu mai este în StripeService.");
            logger.info("🧪 Pentru teste reale, folosește /test-reservation-form");
            
            // Returnează un răspuns care explică situația
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Metoda veche de test nu mai este disponibilă. Folosește /test-reservation-form pentru testarea rezervărilor din formular.",
                "alternativeEndpoint", "/api/stripe/test-reservation-form",
                "testData", mockReservationData
            ));
            
        } catch (Exception e) {
            logger.error("❌ Eroare la testul rezervării cu linii", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Eroare la testul rezervării: " + e.getMessage(),
                "details", e.getClass().getSimpleName()
            ));
        }
    }

    // ==================== ENDPOINT-URI DE VERIFICARE ====================

    /**
     * 🔍 ENDPOINT VERIFICARE: Verifică toate rezervările și liniile din baza de date
     */
    @GetMapping("/check-database")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        try {
            List<Rezervare> toateRezervările = rezervareService.getAllRezervari();
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalRezervari", toateRezervările.size());
            summary.put("timestamp", System.currentTimeMillis());
            
            List<Map<String, Object>> rezervariDetails = new ArrayList<>();
            
            for (Rezervare rezervare : toateRezervările) {
                Map<String, Object> rezervareInfo = new HashMap<>();
                rezervareInfo.put("id", rezervare.getId());
                rezervareInfo.put("cod", rezervare.getCodRezervare());
                rezervareInfo.put("utilizator", rezervare.getUtilizator() != null ? rezervare.getUtilizator().getEmail() : "NULL");
               
                rezervareInfo.put("sumaPlatita", rezervare.getSumaPlatita());
                rezervareInfo.put("dataRezervare", rezervare.getDataRezervare());
                rezervareInfo.put("stare", rezervare.getStareRezervare());
                rezervareInfo.put("createdAt", rezervare.getCreatedAt());
                
                // Verifică liniile
                List<RezervareLinie> linii = rezervareService.getLiniiByRezervareId(rezervare.getId());
                rezervareInfo.put("numarLinii", linii.size());
                
                if (!linii.isEmpty()) {
                    List<Map<String, Object>> liniiDetails = new ArrayList<>();
                    for (RezervareLinie linie : linii) {
                        Map<String, Object> linieInfo = new HashMap<>();
                        linieInfo.put("id", linie.getId());
                        linieInfo.put("cantitate", linie.getCantitate());
                        linieInfo.put("dataInceput", linie.getDataInceput());
                        linieInfo.put("dataSfarsit", linie.getDataSfarsit());
                        linieInfo.put("pretBucata", linie.getPretBucata());
                        linieInfo.put("pretCalculat", linie.getPretCalculat());
                        linieInfo.put("tipEchipament", linie.getTipEchipamentNume());
                        linieInfo.put("echipament", linie.getEchipamentNume());
                        liniiDetails.add(linieInfo);
                    }
                    rezervareInfo.put("linii", liniiDetails);
                }
                
                rezervariDetails.add(rezervareInfo);
            }
            
            summary.put("rezervari", rezervariDetails);
            
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la verificarea bazei de date", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Eroare la verificarea bazei de date: " + e.getMessage()
            ));
        }
    }

    /**
     * 🔍 ENDPOINT RAPID: Verifică doar ultima rezervare și liniile ei
     */
    @GetMapping("/check-last-reservation")
    public ResponseEntity<Map<String, Object>> checkLastReservation() {
        try {
            List<Rezervare> rezervari = rezervareService.getAllRezervari();
            
            if (rezervari.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "Nu există rezervări în baza de date"));
            }
            
            // Găsește ultima rezervare
            Rezervare ultimaRezervare = rezervari.get(rezervari.size() - 1);
            
            Map<String, Object> response = new HashMap<>();
            response.put("ultimaRezervare", Map.of(
                "id", ultimaRezervare.getId(),
                "cod", ultimaRezervare.getCodRezervare(),
                "utilizator", ultimaRezervare.getUtilizator() != null ? ultimaRezervare.getUtilizator().getEmail() : "NULL",
                
                "sumaPlatita", ultimaRezervare.getSumaPlatita(),
                "dataRezervare", ultimaRezervare.getDataRezervare(),
                "stare", ultimaRezervare.getStareRezervare(),
                "createdAt", ultimaRezervare.getCreatedAt()
            ));
            
            // Verifică liniile ultimei rezervări
            List<RezervareLinie> linii = rezervareService.getLiniiByRezervareId(ultimaRezervare.getId());
            response.put("numarLinii", linii.size());
            
            if (!linii.isEmpty()) {
                List<Map<String, Object>> liniiDetails = new ArrayList<>();
                for (RezervareLinie linie : linii) {
                    liniiDetails.add(Map.of(
                        "id", linie.getId(),
                        "cantitate", linie.getCantitate(),
                        "dataInceput", linie.getDataInceput(),
                        "dataSfarsit", linie.getDataSfarsit(),
                        "pretBucata", linie.getPretBucata(),
                        "pretCalculat", linie.getPretCalculat(),
                        "tipEchipament", linie.getTipEchipamentNume(),
                        "echipament", linie.getEchipamentNume()
                    ));
                }
                response.put("linii", liniiDetails);
                response.put("message", "✅ Ultima rezervare ARE linii în baza de date!");
            } else {
                response.put("message", "⚠️ Ultima rezervare NU are linii în baza de date!");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la verificarea ultimei rezervări", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Eroare: " + e.getMessage()
            ));
        }
    }

    /**
     * 🔍 ENDPOINT SPECIAL: Verifică rezervările unui utilizator specific
     */
    @GetMapping("/check-user-reservations/{email}")
    public ResponseEntity<Map<String, Object>> checkUserReservations(@PathVariable String email) {
        try {
            logger.info("🔍 Verificare rezervări pentru utilizatorul: {}", email);
            
            List<Rezervare> rezervariUtilizator = rezervareService.getRezervariByUtilizatorEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("totalRezervari", rezervariUtilizator.size());
            
            List<Map<String, Object>> rezervariDetails = new ArrayList<>();
            
            for (Rezervare rezervare : rezervariUtilizator) {
                Map<String, Object> rezervareInfo = new HashMap<>();
                rezervareInfo.put("id", rezervare.getId());
                rezervareInfo.put("cod", rezervare.getCodRezervare());
               
                rezervareInfo.put("sumaPlatita", rezervare.getSumaPlatita());
                rezervareInfo.put("stare", rezervare.getStareRezervare());
                rezervareInfo.put("dataRezervare", rezervare.getDataRezervare());
                rezervareInfo.put("createdAt", rezervare.getCreatedAt());
                
                // Verifică liniile
                List<RezervareLinie> linii = rezervareService.getLiniiByRezervareId(rezervare.getId());
                rezervareInfo.put("numarLinii", linii.size());
                
                if (!linii.isEmpty()) {
                    List<String> liniiSummary = new ArrayList<>();
                    for (RezervareLinie linie : linii) {
                        liniiSummary.add(String.format("%d × %s = %d RON", 
                                        linie.getCantitate(), 
                                        linie.getTipEchipamentNume(), 
                                        linie.getPretCalculat()));
                    }
                    rezervareInfo.put("liniiSummary", liniiSummary);
                }
                
                rezervariDetails.add(rezervareInfo);
            }
            
            response.put("rezervari", rezervariDetails);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Eroare la verificarea rezervărilor pentru {}", email, e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "email", email
            ));
        }
    }
}