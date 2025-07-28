package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Autowired
    private RezervareService rezervareService;

    @Autowired
    private UserRepository userRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private void initializeStripe() {
        if (Stripe.apiKey == null) {
            Stripe.apiKey = stripeSecretKey;
        }
    }

    /**
     * Creează PaymentIntent pentru rezervare
     */
    public String createPaymentIntent(Long amount, String currency) throws Exception {
        initializeStripe();
        
        logger.info("🔵 Creez PaymentIntent pentru suma: {} {}", amount, currency);
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        
        logger.info("✅ PaymentIntent creat cu ID: {}", intent.getId());
        return intent.getClientSecret();
    }

    /**
     * 🆕 METODĂ ULTRA-SIMPLĂ: FĂRĂ @Transactional pentru a evita rollback-ul
     */
    public Map<String, Object> processReservationFormPayment(String paymentIntentId, Map<String, Object> formData) throws Exception {
        initializeStripe();
        
        logger.info("🔵 === PROCESEZ REZERVARE ULTRA-SIMPLĂ ===");
        logger.info("🔵 PaymentIntent ID: {}", paymentIntentId);
        logger.info("🔵 Form data received: {}", formData);
        
        try {
            // 1. Verifică PaymentIntent în Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            if (!"succeeded".equals(paymentIntent.getStatus())) {
                throw new Exception("Payment not succeeded. Status: " + paymentIntent.getStatus());
            }
            
            logger.info("✅ PaymentIntent confirmat în Stripe");
            
            // 2. Găsește utilizatorul SIMPLU
            User user = findUserSimple(formData);
            logger.info("👤 Utilizator găsit: {} (ID: {})", user.getEmail(), user.getId());
            
            // 3. Creează rezervarea ULTRA-SIMPLU
            Rezervare rezervare = createSimpleRezervare(user, paymentIntentId, formData);
            
           
            
            // 4. Salvează DIRECT cu service-ul (FĂRĂ wrapper transactional)
            Rezervare savedRezervare = rezervareService.saveRezervare(rezervare);
            logger.info("✅ Rezervare salvată cu ID: {}", savedRezervare.getId());
            
            // 5. Răspuns de succes ULTRA-SIMPLU
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rezervare confirmată cu succes!");
            
            Map<String, Object> rezervareInfo = new HashMap<>();
            rezervareInfo.put("id", savedRezervare.getId());
            rezervareInfo.put("codRezervare", savedRezervare.getCodRezervare());
            rezervareInfo.put("stareRezervare", savedRezervare.getStareRezervare());
            
            rezervareInfo.put("sumaPlatita", savedRezervare.getSumaPlatita());
            rezervareInfo.put("numarLinii", 0);
            
            response.put("rezervare", rezervareInfo);
            
            logger.info("🎉 ULTRA-SUCCES! Rezervare {} salvată pentru {}", 
                       savedRezervare.getCodRezervare(), user.getEmail());
            
            return response;
            
        } catch (Exception e) {
            logger.error("❌ Eroare la procesarea rezervării", e);
            throw new Exception("Eroare la procesarea rezervării: " + e.getMessage());
        }
    }

    // ==================== METODE HELPER ULTRA-SIMPLE ====================

    /**
     * 🔧 HELPER ULTRA-SIMPLU: Găsește utilizatorul
     */
    private User findUserSimple(Map<String, Object> formData) throws Exception {
        logger.info("🔍 Extragere utilizator ULTRA-SIMPLĂ");
        
        // 1. ID direct
        Object utilizatorIdObj = formData.get("utilizatorId");
        if (utilizatorIdObj != null) {
            try {
                Long utilizatorId = Long.valueOf(utilizatorIdObj.toString());
                Optional<User> userOpt = userRepository.findById(utilizatorId);
                if (userOpt.isPresent()) {
                    logger.info("✅ Utilizator găsit după ID: {}", utilizatorId);
                    return userOpt.get();
                }
            } catch (Exception e) {
                logger.warn("⚠️ Eroare la găsirea după ID", e);
            }
        }
        
        // 2. Email direct
        String email = extractString(formData, "utilizatorEmail");
        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                logger.info("✅ Utilizator găsit după email: {}", email);
                return userOpt.get();
            }
        }
        
        // 3. Fallback ULTRA-SIMPLU
        logger.warn("⚠️ Folosesc utilizatorul default ID=15");
        return userRepository.findById(15L)
                .orElseThrow(() -> new Exception("Nu s-a găsit utilizatorul default"));
    }

    /**
     * 🔧 HELPER ULTRA-SIMPLU: Creează rezervarea
     */
    private Rezervare createSimpleRezervare(User user, String paymentIntentId, Map<String, Object> formData) {
        Rezervare rezervare = new Rezervare();
        
        // Date de bază ULTRA-SIMPLE
        rezervare.setUtilizator(user);
        rezervare.setStareRezervare("CONFIRMATA");
        rezervare.setCodRezervare("RZ" + System.currentTimeMillis());
        rezervare.setCreatedAt(java.time.LocalDateTime.now());
        rezervare.setStripePaymentIntentId(paymentIntentId);
        
        // Extrage datele ULTRA-SIMPLU
        
        rezervare.setSumaPlatita(extractDouble(formData, "sumaPlatita"));
        rezervare.setDataRezervare(parseDate(extractString(formData, "dataRezervare")));
        
        // Validări și default-uri
       
        
        if (rezervare.getSumaPlatita() == null) {
            rezervare.setSumaPlatita(100.0);
        }
        if (rezervare.getDataRezervare() == null) {
            rezervare.setDataRezervare(java.time.LocalDate.now());
        }
        
        logger.info("📋 Rezervare creată: {} - {} RON", 
                 rezervare.getSumaPlatita());
        
        return rezervare;
    }

    // ==================== HELPER-I ULTRA-STATICI ====================

    private String extractString(Map<String, Object> data, String key) {
        Object value = data.get(key);
        return (value != null && !value.toString().trim().isEmpty()) ? value.toString() : null;
    }

    private Double extractDouble(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null) return null;
        
        try {
            if (value instanceof Number) {
                return ((Number) value).doubleValue();
            } else if (value instanceof String) {
                return Double.parseDouble((String) value);
            }
        } catch (NumberFormatException e) {
            logger.warn("⚠️ Nu s-a putut converti '{}' la Double", value);
        }
        return null;
    }

    private java.time.LocalDate parseDate(String dateStr) {
        if (dateStr == null) return java.time.LocalDate.now();
        
        try {
            return java.time.LocalDate.parse(dateStr);
        } catch (Exception e) {
            logger.warn("⚠️ Nu pot parsa data: {}, folosesc azi", dateStr);
            return java.time.LocalDate.now();
        }
    }
}