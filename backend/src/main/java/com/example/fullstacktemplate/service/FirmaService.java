package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.FirmaRepository;
import com.example.fullstacktemplate.repository.PlajaRepository;
import com.example.fullstacktemplate.repository.RezervareRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

@Service
public class FirmaService {

    private final FirmaRepository repository;
    private final PlajaRepository plajaRepository;
    private final RezervareRepository rezervareRepository;
    private final CerereManagerRepository cerereManagerRepository;

    @Autowired
    public FirmaService(FirmaRepository repository, PlajaRepository plajaRepository,
            RezervareRepository rezervareRepository, CerereManagerRepository cerereManagerRepository) {
        this.repository = repository;
        this.plajaRepository = plajaRepository;
        this.rezervareRepository = rezervareRepository;
        this.cerereManagerRepository = cerereManagerRepository;
    }

    public List<Firma> findAll() {
        return repository.findAll();
    }

    public Optional<Firma> findById(Integer id) {
        return repository.findById(id);
    }

    public Firma save(Firma firma) {
        return repository.save(firma);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    public Optional<Firma> findByUserId(Integer userId) {
        CerereManager cr = cerereManagerRepository.findByUserId(Long.valueOf(userId)).orElse(null);
        if (cr != null) {
            return repository.findByCui(cr.getCui());
        }
        return null;
    }

    /**
     * Inactivează plajele unei firme care a devenit inactivă,
     * dar doar dacă nu există rezervări active
     */
    public void inactivateBeachesForInactiveCompany(Integer firmaId) {
        Firma company = repository.findById(firmaId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + firmaId));

        // if (company.getActiv()) {
        // throw new IllegalStateException("Company is still active. Cannot inactivate
        // beaches.");
        // }

        System.out.println("inactivateBeachesForInactiveCompany->hasActiveBookingsForFirma: "
                + hasActiveBookingsForFirma(firmaId));
        boolean hasActiveBookings = hasActiveBookingsForFirma(firmaId);

        if (hasActiveBookings) {
            throw new IllegalStateException("Company has active bookings. Cannot inactivate beaches.");
        }

        List<Plaja> companyBeaches = plajaRepository.findByFirmaId(firmaId);

        for (Plaja beach : companyBeaches) {
            if (beach.getActiv()) {
                inactivateBeachIfNoActiveBookings(beach);
            }
        }
    }

    /**
     * Verifică dacă o plajă are rezervări active prin LinieRezervare
     */
    private boolean hasActiveBookingsForBeach(Integer beachId) {
        return rezervareRepository.existaRezervariActivePentruPlaja(beachId);
    }

    public boolean hasActiveBookingsForFirma(Integer firmaId) {
        System.out.println("rezervareRepository.existRezervariActivePentruFirma(firmaId): "
                + rezervareRepository.existRezervariActivePentruFirma(firmaId));
        return rezervareRepository.existRezervariActivePentruFirma(firmaId);
    }

    /*
     * Inactivează o plajă dacă nu are rezervări active
     */
    private void inactivateBeachIfNoActiveBookings(Plaja beach) {
        boolean hasActiveBookings = hasActiveBookingsForBeach(beach.getId());

        if (!hasActiveBookings) {
            beach.setActiv(false);
            plajaRepository.save(beach);
            return;
        }
        throw new IllegalStateException("Nu putem inactiva firma - are plaje cu rezervari active!!!");

    }

    public void activarePlajaPentruFirma(Integer firmaId) {
        List<Plaja> plaje = plajaRepository.findByFirmaId(firmaId);
        for (Plaja plaja : plaje) {
            plaja.setActiv(true);
            plajaRepository.save(plaja);
        }
    }
}
