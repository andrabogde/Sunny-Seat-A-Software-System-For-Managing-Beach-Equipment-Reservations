package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.config.AppProperties;
import com.example.fullstacktemplate.dto.CerereManagerDto;
import com.example.fullstacktemplate.model.*;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.FirmaRepository;
import com.example.fullstacktemplate.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CerereManagerService {

    private final CerereManagerRepository cerereRepo;
    private final UserRepository userRepo;
    private final FirmaRepository firmaRepo;
    @Autowired
    private AppProperties appProperties;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private EmailService emailService;

    @Value("${app.frontEndUri}")
    private String frontEndUri;

    public CerereManagerService(CerereManagerRepository cerereRepo,
            UserRepository userRepo,
            FirmaRepository firmaRepo) {
        this.cerereRepo = cerereRepo;
        this.userRepo = userRepo;
        this.firmaRepo = firmaRepo;
    }

    // ✅ Returnează toate cererile
    public List<CerereManager> getAllCereri() {
        return cerereRepo.findAll();
    }

    // ✅ Returnează doar cererile în așteptare
    public List<CerereManager> getAllInAsteptare() {
        return cerereRepo.findByStatus(StatusCerere.IN_ASTEPTARE);
    }

    // ✅ Găsește cerere după ID
    public CerereManager getCerereById(Long id) {
        return cerereRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost găsită"));
    }

    // ✅ Găsește cererile unui utilizator
    public List<CerereManager> getCereriByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));
        return cerereRepo.findByUserOrderByIdDesc(user);
    }

    // ✅ Găsește cereri după status
    public List<CerereManager> getCereriByStatus(StatusCerere status) {
        return cerereRepo.findByStatus(status);
    }

    // ✅ Creează o nouă cerere manager
    @Transactional
    public CerereManager create(CerereManagerDto dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

        // ✅ Verifică dacă utilizatorul are deja o cerere în așteptare
        if (cerereRepo.existsByUserAndStatus(user, StatusCerere.IN_ASTEPTARE)) {
            throw new RuntimeException("Utilizatorul are deja o cerere în așteptare");
        }

        // ✅ Verifică dacă CUI-ul este deja folosit
        if (cerereRepo.existsByCui(dto.getCui()) || firmaRepo.existsByCui(dto.getCui())) {
            throw new RuntimeException("CUI-ul " + dto.getCui() + " este deja folosit");
        }

        CerereManager cerere = CerereManager.builder()
                .user(user)
                .cui(dto.getCui())
                .denumire(dto.getDenumire())
                .adresa(dto.getAdresa())
                .telefon(dto.getTelefon())
                .email(dto.getEmail())
                .localitate(dto.getLocalitateId())
                .status(StatusCerere.IN_ASTEPTARE)
                .build();

        JwtToken jwtToken = tokenService.createToken(user,
                Duration.of(appProperties.getAuth().getVerificationTokenExpirationMsec(), ChronoUnit.MILLIS),
                TokenType.ACCOUNT_ACTIVATION);

        String activationUrl = String.format("%s/activate-account?token=%s&email=%s",
                frontEndUri,
                jwtToken.getValue(),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8));

        log.info("🔗 Generated activation URL: {}", activationUrl);

        // PASUL 5: Trimit email de activare cu informații despre cererea de manager
        String emailBody = String.format(
                "Bună ziua %s,\n\n" +
                        "Contul dumneavoastră a fost creat cu succes!\n\n" +
                        "Pentru a vă activa contul, accesați următorul link: %s\n\n" +
                        "De asemenea, cererea dumneavoastră pentru firma \"%s\" (CUI: %s) a fost înregistrată și va fi analizată de administratori în maxim 2-3 zile lucrătoare.\n\n"
                        +
                        "Până la aprobarea cererii, veți putea folosi platforma ca CLIENT pentru a face rezervări.\n\n"
                        +
                        "Veți primi o notificare prin email când cererea va fi procesată.\n\n" +
                        "Cu stimă,\n" +
                        "Echipa %s",
                user.getName(),
                activationUrl,
                dto.getDenumire(),
                dto.getCui(),
                appProperties.getAppName());

        emailService.sendSimpleMessage(
                dto.getEmail(),
                appProperties.getAppName() + " - Activare cont + Cerere manager",
                emailBody);

        return cerereRepo.save(cerere);
    }

    // ✅ Aprobă cererea cu id-ul specificat
    @Transactional
    public void aprobaCerere(Long id) {
        CerereManager cerere = cerereRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost găsită"));

        // ✅ Verifică dacă cererea poate fi aprobată
        if (!cerere.isInAsteptare()) {
            throw new RuntimeException("Doar cererile în așteptare pot fi aprobate");
        }

        // ✅ Verificăm dacă firma deja există (double-check)
        if (!firmaRepo.existsByCui(cerere.getCui())) {
            Firma firma = Firma.builder()
                    .cui(cerere.getCui())
                    .denumire(cerere.getDenumire())
                    .adresa(cerere.getAdresa())
                    .telefon(cerere.getTelefon())
                    .email(cerere.getEmail())
                    .localitate(cerere.getLocalitate())
                    .activ(true)
                    .build();

            firmaRepo.save(firma);
        }

        // ✅ Actualizăm statusul cererii
        cerere.setStatus(StatusCerere.APROBAT);
        cerereRepo.save(cerere);

        // ✅ Actualizăm rolul utilizatorului
        User user = cerere.getUser();
        user.setRole(Role.MANAGER);
        userRepo.save(user);
    }

    // ✅ Respinge cererea cu motiv
    @Transactional
    public void respingeCerere(Long id, String motiv) {
        CerereManager cerere = cerereRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost găsită"));

        // ✅ Verifică dacă cererea poate fi respinsă
        if (!cerere.isInAsteptare()) {
            throw new RuntimeException("Doar cererile în așteptare pot fi respinse");
        }

        cerere.setStatus(StatusCerere.RESPINS);
        cerere.setMotivRespingere(motiv);
        String userName = cerere.getUser().getName();

        // PASUL 5: Trimit email de activare cu informații despre cererea de manager
        String emailBody = String.format(
                "Bună ziua %s,\n\n" +
                        "Cererea dumneavoastră pentru firma \"%s\" (CUI: %s) a fost analizată, însă nu poate fi aprobată din următorul motiv:\n\n"
                        +
                        "❗ %s\n\n" +
                        "Până la trimiterea unei noi cereri sau corectarea situației, veți putea folosi platforma în continuare ca și CLIENT pentru a face rezervări.\n\n"
                        +
                        "Vă mulțumim pentru înțelegere și vă stăm la dispoziție pentru întrebări suplimentare.\n\n" +
                        "Cu stimă,\n" +
                        "Echipa %s",
                userName,
                cerere.getDenumire(),
                cerere.getCui(),
                cerere.getMotivRespingere(), // variabilă de tip String cu motivul respingerii
                appProperties.getAppName());

        emailService.sendSimpleMessage(
                cerere.getEmail(),
                appProperties.getAppName() + " - Notificare privind respingerea cererii",
                emailBody);

        cerereRepo.save(cerere);
    }

    // ✅ Overload pentru compatibilitate cu codul existent
    public void respingeCerere(Long id) {
        respingeCerere(id, null);
    }

    // ✅ Statistici pentru dashboard admin
    public Map<String, Object> getStatistici() {
        List<Object[]> rezultate = cerereRepo.getStatisticiStatusuri();

        Map<String, Long> statusCount = new HashMap<>();
        long total = 0;

        for (Object[] row : rezultate) {
            StatusCerere status = (StatusCerere) row[0];
            Long count = (Long) row[1];
            statusCount.put(status.getDisplayName(), count);
            total += count;
        }

        return Map.of(
                "total", total,
                "inAsteptare", statusCount.getOrDefault(StatusCerere.IN_ASTEPTARE.getDisplayName(), 0L),
                "aprobate", statusCount.getOrDefault(StatusCerere.APROBAT.getDisplayName(), 0L),
                "respinse", statusCount.getOrDefault(StatusCerere.RESPINS.getDisplayName(), 0L),
                "detaliiStatus", statusCount);
    }

    // ✅ Verifică dacă CUI este disponibil (nu există în cereri sau firme)
    public boolean isCuiDisponibil(String cui) {
        return !cerereRepo.existsByCui(cui) && !firmaRepo.existsByCui(cui);
    }

    // ✅ Anulează cererea (doar dacă este în așteptare)
    @Transactional
    public void anuleazaCerere(Long id) {
        CerereManager cerere = cerereRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost găsită"));

        if (!cerere.isInAsteptare()) {
            throw new RuntimeException("Doar cererile în așteptare pot fi anulate");
        }

        cerereRepo.delete(cerere);
    }

    // ✅ Verifică dacă un utilizator poate crea o cerere nouă
    public boolean canUserCreateCerere(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

        // Nu poate dacă are deja o cerere în așteptare
        return !cerereRepo.existsByUserAndStatus(user, StatusCerere.IN_ASTEPTARE);
    }

    // ✅ Returnează ultima cerere a unui utilizator
    public CerereManager getUltimaCerereUtilizator(Long userId) {
        List<CerereManager> cereri = getCereriByUserId(userId);
        if (cereri.isEmpty()) {
            throw new RuntimeException("Utilizatorul nu are nicio cerere");
        }
        return cereri.get(0); // Prima din listă (ordonată descrescător)
    }

    // Adaugă această metodă în CerereManagerService.java:

    /**
     * 🚑 QUICK FIX - obține cereri fără relații complexe
     */
    // ✅ CORECTARE în Service:
    public List<CerereManager> getAllCereriSimple() {
        try {
            log.info("🚑 Getting all requests with simple query");

            // ✅ CORECTARE: folosește numele corect al repository-ului
            List<CerereManager> cereri = cerereRepo.findAllByOrderByCreatedAtDesc();

            if (cereri.size() > 100) {
                log.warn("⚠️ Large dataset detected ({}), limiting to first 100", cereri.size());
                cereri = cereri.subList(0, 100);
            }

            log.info("✅ Retrieved {} requests successfully", cereri.size());
            return cereri;

        } catch (Exception e) {
            log.error("❌ Error getting simple requests", e);
            throw new RuntimeException("Eroare la obținerea cererilor simple: " + e.getMessage());
        }
    }
}