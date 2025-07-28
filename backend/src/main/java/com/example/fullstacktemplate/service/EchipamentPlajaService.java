package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.model.EchipamentPlaja;
import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.Pret;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.EchipamentPlajaRepository;
import com.example.fullstacktemplate.repository.PretRepository;
import com.example.fullstacktemplate.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EchipamentPlajaService {

    @Autowired
    private EchipamentPlajaRepository echipamentPlajaRepository;

    @Autowired
    private PretService pretService;
    @Autowired
    private PretRepository pretRepository;
    @Autowired
    private CerereManagerRepository cerereManagerRepository;
    @Autowired
    private UserRepository userRepository;

    // ==================== METODELE TALE EXISTENTE ====================

    public List<EchipamentPlaja> getAllEchipamentePlaja() {
        List<EchipamentPlaja> echipamente = echipamentPlajaRepository.findAll();

        // Încarcă prețul curent pentru fiecare echipament
        for (EchipamentPlaja echipament : echipamente) {
            loadPretCurent(echipament);
        }
        return echipamente.stream().map((el) -> {
            Plaja plaja = el.getPlaja();
            Firma firma = plaja.getFirma();
            System.out.println("Firma gasita este " + firma);
            CerereManager cr = cerereManagerRepository.findByCui(firma.getCui()).orElse(null);
            if (cr != null) {
                User user = userRepository.findByEmail(cr.getEmail()).orElse(null);
                if (user != null) {
                    el.setUserId(user.getId().intValue());
                }
            }
            return el;
        })
        // .filter(el->{
        //     return !el.getStareEchipament().getDenumire().equals("Loc liber");
        // })
        .collect(Collectors.toList());

    }

    public Optional<EchipamentPlaja> getEchipamentPlajaById(Integer id) {
        Optional<EchipamentPlaja> echipament = echipamentPlajaRepository.findById(id);
        if (echipament.isPresent()) {
            // Încarcă prețul curent
            loadPretCurent(echipament.get());
        }
        return echipament;
    }

    public EchipamentPlaja saveEchipamentPlaja(EchipamentPlaja echipament) {
        // Setează data de creare dacă este nou
        // if (echipament.getId() == null && echipament.getDataOra() == null) {
        // echipament.setDataOra(LocalDateTime.now());
        // }

        return echipamentPlajaRepository.save(echipament);
    }

    // 🆕 DOAR ACEASTĂ METODĂ NOUĂ pentru compatibilitatea cu controllerul tău
    @Transactional
    public EchipamentPlaja saveEchipamentPlajaWithPret(EchipamentPlaja echipament, Integer pretValoare) {
        // Salvează echipamentul mai întâi
        EchipamentPlaja savedEchipament = saveEchipamentPlaja(echipament);

        // Creează și salvează prețul dacă este specificat
        if (pretValoare != null && pretValoare > 0) {
            Pret pret = new Pret();
            pret.setEchipamentPlajaId(savedEchipament.getId());
            pret.setValoare(pretValoare);
            pret.setDataOra(LocalDateTime.now());

            Pret savedPret = pretService.save(pret);

            // Setează prețul curent în echipament
            savedEchipament.setPretCurent(savedPret);
        }

        return savedEchipament;
    }

    public void deleteEchipamentPlaja(Integer id) {
        echipamentPlajaRepository.deleteById(id);
    }

    // ==================== METODA HELPER ====================

    /**
     * Încarcă prețul curent pentru un echipament folosind serviciul tău existent
     */
    private void loadPretCurent(EchipamentPlaja echipament) {
        try {
            Optional<Pret> pretCurent = pretService.findLatestPretByEchipamentPlajaId(echipament.getId());
            if (pretCurent.isPresent()) {
                echipament.setPretCurent(pretCurent.get());
            }
        } catch (Exception e) {
            // Ignoră eroarea dacă nu poate încărca prețul
        }
    }

    public List<EchipamentPlaja> getEchipamenteByPlajaId(Integer plajaId) {
        List<EchipamentPlaja> echipamente = echipamentPlajaRepository
                .findByPlajaIdOrderByPozitieLinieAscPozitieColoanaAsc(plajaId);
        for (EchipamentPlaja ep : echipamente) {
            Optional<Pret> ultimulPret = pretRepository
                    .findTopByEchipamentPlajaIdOrderByDataOraDesc(ep.getId());
            ultimulPret.ifPresent(ep::setPretCurent);
        }
        return echipamente;
    }

    @Transactional
    public void stergeEchipamenteDupaPlaja(Integer plajaId) {
        echipamentPlajaRepository.deletePreturiByPlajaId(plajaId);
        echipamentPlajaRepository.deleteByPlajaId(plajaId);
    }
}