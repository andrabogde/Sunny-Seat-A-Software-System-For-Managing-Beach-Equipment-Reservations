package com.example.fullstacktemplate.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.fullstacktemplate.dto.EquipmentPriceDTO;
import com.example.fullstacktemplate.model.*;
import com.example.fullstacktemplate.repository.EchipamentPlajaRepository;
import com.example.fullstacktemplate.service.EchipamentPlajaService;
import com.example.fullstacktemplate.service.PretService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preturi")
@CrossOrigin(origins = "*")
public class PretController {

    private final PretService pretService;
    private final EchipamentPlajaRepository echipamentPlajaRepository;

    @Autowired
    private EchipamentPlajaService echipamentPlajaService;

    @Autowired
    public PretController(PretService pretService, EchipamentPlajaRepository echipamentPlajaRepository) {
        this.pretService = pretService;
        this.echipamentPlajaRepository = echipamentPlajaRepository;
    }
    
    // GET - Obține toate prețurile simple
    @GetMapping
    public ResponseEntity<List<Pret>> getAllPreturi() {
        List<Pret> preturi = pretService.findAll();
        return ResponseEntity.ok(preturi);
    }

    // GET - Obține toate prețurile cu detalii extinse
    @GetMapping("/with-full-details")
    public ResponseEntity<List<EquipmentPriceDTO>> getAllPreturiWithFullDetails() {
        List<Pret> preturi = pretService.findAll();
        List<EquipmentPriceDTO> result = new ArrayList<>();

        for (Pret pret : preturi) {
            Optional<EchipamentPlaja> echipOpt = echipamentPlajaRepository.findById(pret.getEchipamentPlajaId());
            if (echipOpt.isEmpty()) continue;

            EchipamentPlaja echip = echipOpt.get();
            Plaja plaja = echip.getPlaja();
            Firma firma = plaja.getFirma();
            Statiune statiune = plaja.getStatiune();
            TipEchipamentPlaja tip = echip.getTipEchipament();

            EquipmentPriceDTO dto = new EquipmentPriceDTO();
            dto.setPretId(pret.getId());
            dto.setEchipamentPlajaId(pret.getEchipamentPlajaId());
            dto.setValoare(pret.getValoare());
            dto.setDataOra(pret.getDataOra());

            dto.setPlajaDenumire(plaja.getDenumire());
            dto.setFirmaNume(firma.getDenumire());
            dto.setStatiuneNume(statiune.getDenumire());
            dto.setEchipamentDenumire(echip.getDenumire());
            dto.setTipEchipamentNume(tip.getDenumire());

            dto.setPozitioLinie(echip.getPozitieLinie());
            dto.setPozitioColoana(echip.getPozitieColoana());

            dto.setPlajaId(plaja.getId());
            dto.setTipEchipamentId(tip.getId());
            dto.setFirmaId(firma.getId());
            dto.setStatiuneId(statiune.getId());

            result.add(dto);
        }

        return ResponseEntity.ok(result);
    }

    // GET - Obține toate prețurile pentru plajă și tip echipament
    @GetMapping("/with-details")
public ResponseEntity<List<EquipmentPriceDTO>> getPreturiWithDetails() {
    List<Pret> toatePreturile = pretService.findAll();

    List<EquipmentPriceDTO> dtos = toatePreturile.stream()
        .map(pret -> {
            Optional<EchipamentPlaja> echipamentOpt = echipamentPlajaService.getEchipamentPlajaById(pret.getEchipamentPlajaId());
            if (echipamentOpt.isEmpty()) return null;

            EchipamentPlaja echipament = echipamentOpt.get();
            Plaja plaja = echipament.getPlaja();
            Firma firma = plaja.getFirma();
            Statiune statiune = plaja.getStatiune();
            TipEchipamentPlaja tip = echipament.getTipEchipament();

            EquipmentPriceDTO dto = new EquipmentPriceDTO();
            dto.setPretId(pret.getId());
            dto.setEchipamentPlajaId(pret.getEchipamentPlajaId());
            dto.setValoare(pret.getValoare());
            dto.setDataOra(pret.getDataOra());

            dto.setPlajaDenumire(plaja.getDenumire());
            dto.setFirmaNume(firma.getDenumire());
            dto.setStatiuneNume(statiune.getDenumire());
            dto.setEchipamentDenumire(echipament.getDenumire());
            dto.setTipEchipamentNume(tip.getDenumire());

            dto.setPozitioLinie(echipament.getPozitieLinie());
            dto.setPozitioColoana(echipament.getPozitieColoana());

            dto.setPlajaId(plaja.getId());
            dto.setTipEchipamentId(tip.getId());
            dto.setFirmaId(firma.getId());
            dto.setStatiuneId(statiune.getId());

            return dto;
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

    return ResponseEntity.ok(dtos);
}

    // GET - Obține un preț după ID
    @GetMapping("/{id}")
    public ResponseEntity<Pret> getPretById(@PathVariable Integer id) {
        Optional<Pret> pret = pretService.findById(id);
        return pret.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST - Creează un preț nou
    @PostMapping
    public ResponseEntity<Pret> createPret(@RequestBody Pret pret) {
        try {
            if (pret.getDataOra() == null) {
                pret.setDataOra(LocalDateTime.now());
            }
            Pret savedPret = pretService.save(pret);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPret);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // PUT - Actualizează un preț existent
    @PutMapping("/{id}")
    public ResponseEntity<Pret> updatePret(@PathVariable Integer id, @RequestBody Pret pretDetails) {
        Optional<Pret> optionalPret = pretService.findById(id);

        if (optionalPret.isPresent()) {
            Pret pret = optionalPret.get();
            pret.setEchipamentPlajaId(pretDetails.getEchipamentPlajaId());
            pret.setValoare(pretDetails.getValoare());
            if (pretDetails.getDataOra() != null) {
                pret.setDataOra(pretDetails.getDataOra());
            }
            Pret updatedPret = pretService.save(pret);
            return ResponseEntity.ok(updatedPret);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Șterge un preț
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePret(@PathVariable Integer id) {
        Optional<Pret> pret = pretService.findById(id);
        if (pret.isPresent()) {
            pretService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Obține prețul curent (cel mai recent)
    @GetMapping("/echipament/{echipamentPlajaId}/curent")
    public ResponseEntity<Pret> getPretCurent(@PathVariable Integer echipamentPlajaId) {
        Optional<Pret> pretCurent = pretService.findLatestPretByEchipamentPlajaId(echipamentPlajaId);
        return pretCurent.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // GET - Istoric prețuri pentru un echipament
    @GetMapping("/echipament/{echipamentPlajaId}/istoric")
    public ResponseEntity<List<Pret>> getIstoricPreturi(@PathVariable Integer echipamentPlajaId) {
        List<Pret> preturi = pretService.getPreturiByEchipamentPlajaId(echipamentPlajaId);
        return ResponseEntity.ok(preturi);
    }

    // GET - Verifică dacă există prețuri pentru un echipament
    @GetMapping("/echipament/{echipamentPlajaId}/exists")
    public ResponseEntity<Boolean> hasPrices(@PathVariable Integer echipamentPlajaId) {
        List<Pret> preturi = pretService.getPreturiByEchipamentPlajaId(echipamentPlajaId);
        return ResponseEntity.ok(!preturi.isEmpty());
    }
}
