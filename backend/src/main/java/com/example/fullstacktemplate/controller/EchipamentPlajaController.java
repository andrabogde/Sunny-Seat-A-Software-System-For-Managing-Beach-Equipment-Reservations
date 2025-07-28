package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.EchipamentPlajaDTO;
import com.example.fullstacktemplate.dto.PretDTO;
import com.example.fullstacktemplate.model.EchipamentPlaja;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.Pret;
import com.example.fullstacktemplate.model.StareEchipamentPlaja;
import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import com.example.fullstacktemplate.service.EchipamentPlajaService;
import com.example.fullstacktemplate.service.PretService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/echipamente-plaja")
public class EchipamentPlajaController {

    @Autowired
    private EchipamentPlajaService echipamentPlajaService;
    @Autowired
    private PretService pretService;

    @GetMapping
    public List<EchipamentPlajaDTO> getAllEchipamentePlaja() {
        return echipamentPlajaService.getAllEchipamentePlaja().stream()
                .map(e -> new EchipamentPlajaDTO(
                        e.getId(),
                        e.getDenumire(),
                        e.getPlaja().getId(),
                        e.getPlaja().getDenumire(),
                        e.getTipEchipament().getId(),
                        e.getTipEchipament().getDenumire(),
                        e.getStareEchipament().getId(),
                        e.getStareEchipament().getDenumire(),
                        e.getPozitieLinie(),
                        e.getPozitieColoana(),
                        e.getPretCurent()!=null ? e.getPretCurent().getValoare():0,
                        e.getActiv(),e.getUserId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EchipamentPlajaDTO> getEchipamentPlajaById(@PathVariable Integer id) {
        Optional<EchipamentPlaja> echipament = echipamentPlajaService.getEchipamentPlajaById(id);

        return echipament.map(e -> ResponseEntity.ok(new EchipamentPlajaDTO(
                e.getId(),
                e.getDenumire(),
                e.getPlaja().getId(),
                e.getPlaja().getDenumire(),
                e.getTipEchipament().getId(),
                e.getTipEchipament().getDenumire(),
                e.getStareEchipament().getId(),
                e.getStareEchipament().getDenumire(),
                e.getPozitieLinie(),
                e.getPozitieColoana(),
                e.getPretCurent()!=null ? e.getPretCurent().getValoare():0,
                e.getActiv(),e.getUserId()))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EchipamentPlajaDTO createEchipamentPlaja(@RequestBody EchipamentPlajaDTO echipamentPlaja) {
        EchipamentPlaja newEchipamentPlaja = new EchipamentPlaja();
        Plaja plaja = new Plaja();
        plaja.setId(echipamentPlaja.getPlajaId());
        newEchipamentPlaja.setDenumire(echipamentPlaja.getDenumire());
        newEchipamentPlaja.setPlaja(plaja);
        TipEchipamentPlaja tipEchipamentPlaja = new TipEchipamentPlaja();
        tipEchipamentPlaja.setId(echipamentPlaja.getTipEchipamentId());
        newEchipamentPlaja.setTipEchipament(tipEchipamentPlaja);
        StareEchipamentPlaja stareEchipamentPlaja = new StareEchipamentPlaja();
        stareEchipamentPlaja.setId(echipamentPlaja.getStareEchipamentId());
        newEchipamentPlaja.setStareEchipament(stareEchipamentPlaja);
        newEchipamentPlaja.setPozitieLinie(echipamentPlaja.getPozitieLinie());
        newEchipamentPlaja.setPozitieColoana(echipamentPlaja.getPozitieColoana());
        newEchipamentPlaja.setActiv(true);

        EchipamentPlaja savedEchipamentPlaja = echipamentPlajaService.saveEchipamentPlajaWithPret(newEchipamentPlaja,
                echipamentPlaja.getPretCurent());
        echipamentPlaja.setId(savedEchipamentPlaja.getId());

        return echipamentPlaja;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EchipamentPlajaDTO> patchEchipamentPlaja(
            @PathVariable Integer id,
            @RequestBody EchipamentPlajaDTO patchDTO) {

        return echipamentPlajaService.getEchipamentPlajaById(id)
                .map(existingEchipamentPlaja -> {
                    // Aplică modificările doar dacă sunt prezente în DTO
                    if (patchDTO.getPlajaId() != null) {
                        existingEchipamentPlaja.getPlaja().setId(patchDTO.getPlajaId());
                    }
                    if (patchDTO.getTipEchipamentId() != null) {
                        existingEchipamentPlaja.getTipEchipament().setId(patchDTO.getTipEchipamentId());
                    }
                    if (patchDTO.getStareEchipamentId() != null) {
                        existingEchipamentPlaja.getStareEchipament().setId(patchDTO.getStareEchipamentId());
                    }
                    if (patchDTO.getPozitieLinie() != null) {
                        existingEchipamentPlaja.setPozitieLinie(patchDTO.getPozitieLinie());
                    }
                    if (patchDTO.getPozitieColoana() != null) {
                        existingEchipamentPlaja.setPozitieColoana(patchDTO.getPozitieColoana());
                    }
                    // if (patchDTO.getPretCurent() != null) {
                    // existingEchipamentPlaja.setPretCurent(patchDTO.getPretCurent());
                    // }
                    if (patchDTO.getActiv() != null) {
                        existingEchipamentPlaja.setActiv(patchDTO.getActiv());
                    }
                    EchipamentPlaja e;

                    if (patchDTO.getPretCurent() != null)
                        e = echipamentPlajaService.saveEchipamentPlajaWithPret(existingEchipamentPlaja,
                                patchDTO.getPretCurent());
                    else
                        e = echipamentPlajaService.saveEchipamentPlaja(existingEchipamentPlaja);
                    EchipamentPlajaDTO echipamentPlajaDTO = new EchipamentPlajaDTO(
                            e.getId(),
                            e.getDenumire(),
                            e.getPlaja().getId(),
                            e.getPlaja().getDenumire(),
                            e.getTipEchipament().getId(),
                            e.getTipEchipament().getDenumire(),
                            e.getStareEchipament().getId(),
                            e.getStareEchipament().getDenumire(),
                            e.getPozitieLinie(),
                            e.getPozitieColoana(),
                            e.getPretCurent().getValoare(),
                            e.getActiv(),e.getUserId());
                    return ResponseEntity.ok(echipamentPlajaDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

     @GetMapping("/{id}/preturi")
    public ResponseEntity<List<PretDTO>> getPreturiForEchipament(@PathVariable Integer id) {
        List<Pret> preturi = pretService.getPreturiByEchipamentPlajaId(id);

        if (preturi.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<PretDTO> preturiDTO = preturi.stream()
                .map(p -> new PretDTO(p.getId(), p.getEchipamentPlajaId(), p.getValoare(), p.getDataOra()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(preturiDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EchipamentPlaja> updateEchipamentPlaja(
            @PathVariable Integer id, @RequestBody EchipamentPlaja updatedEchipamentPlaja) {
        return echipamentPlajaService.getEchipamentPlajaById(id)
                .map(existingEchipamentPlaja -> {
                    updatedEchipamentPlaja.setId(id);
                    return ResponseEntity.ok(echipamentPlajaService.saveEchipamentPlaja(updatedEchipamentPlaja));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEchipamentPlaja(@PathVariable Integer id) {
        if (echipamentPlajaService.getEchipamentPlajaById(id).isPresent()) {
            echipamentPlajaService.deleteEchipamentPlaja(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/by-plaja/{plajaId}")
    public ResponseEntity<Void> deleteEchipamentPlajaByPlajaId(@PathVariable Integer plajaId) {
            echipamentPlajaService.stergeEchipamenteDupaPlaja(plajaId);
            return ResponseEntity.noContent().build();
    }


    @GetMapping("/by-plaja/{plajaId}")
public List<EchipamentPlajaDTO> getEchipamenteByPlajaId(@PathVariable Integer plajaId) {
    return echipamentPlajaService.getEchipamenteByPlajaId(plajaId).stream()
            .map(e -> new EchipamentPlajaDTO(
                    e.getId(),
                    e.getDenumire(),
                    e.getPlaja().getId(),
                    e.getPlaja().getDenumire(),
                    e.getTipEchipament().getId(),
                    e.getTipEchipament().getDenumire(),
                    e.getStareEchipament().getId(),
                    e.getStareEchipament().getDenumire(),
                    e.getPozitieLinie(),
                    e.getPozitieColoana(),
                    e.getPretCurent() != null ? e.getPretCurent().getValoare() : null,
                    e.getActiv(),e.getUserId()))
            .collect(Collectors.toList());
}

}
