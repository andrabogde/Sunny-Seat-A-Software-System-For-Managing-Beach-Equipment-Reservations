package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.TipEchipamentPlajaDTO;
import com.example.fullstacktemplate.model.TipEchipamentPlaja;
import com.example.fullstacktemplate.service.TipEchipamentPlajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tipuri-echipamente-plaja")
public class TipEchipamentPlajaController {

    private final TipEchipamentPlajaService service;

    @Autowired
    public TipEchipamentPlajaController(TipEchipamentPlajaService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipEchipamentPlaja> getAllTipuriEchipamentePlaja() {
        // 🔧 CORECT: folosește numele metodei din serviciu
        return service.getAllTipuriEchipament();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipEchipamentPlaja> getTipEchipamentPlajaById(@PathVariable Integer id) {
        // 🔧 CORECT: folosește numele metodei din serviciu
        return service.getTipEchipamentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipEchipamentPlaja> createTipEchipamentPlaja(@RequestBody TipEchipamentPlaja tipEchipamentPlaja) {
        if (tipEchipamentPlaja.getId() != null) {
            return ResponseEntity.badRequest().body(null); // Refuză cererea dacă ID-ul este prezent
        }
        // 🔧 CORECT: folosește numele metodei din serviciu
        TipEchipamentPlaja created = service.saveTipEchipament(tipEchipamentPlaja);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TipEchipamentPlaja> updateTipEchipamentPlaja(@PathVariable Integer id, @RequestBody TipEchipamentPlaja updatedTip) {
        // 🔧 CORECT: folosește numele metodei din serviciu
        return service.getTipEchipamentById(id)
                .map(existingTip -> {
                    existingTip.setDenumire(updatedTip.getDenumire());
                    //existingTip.setActiv(updatedTip.getActiv());
                    service.saveTipEchipament(existingTip);
                    return ResponseEntity.ok(existingTip);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TipEchipamentPlaja> patchTipEchipamentPlaja(@PathVariable Integer id, @RequestBody TipEchipamentPlajaDTO patchDto) {
        // 🔧 CORECT: folosește numele metodei din serviciu
        Optional<TipEchipamentPlaja> existingTipOpt = service.getTipEchipamentById(id);

        if (!existingTipOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        TipEchipamentPlaja existingTip = existingTipOpt.get();

        if (patchDto.getDenumire() != null) {
            existingTip.setDenumire(patchDto.getDenumire());
        }

        // 🔧 CORECT: folosește numele metodei din serviciu
        service.saveTipEchipament(existingTip);
        return ResponseEntity.ok(existingTip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipEchipamentPlaja(@PathVariable Integer id) {
        // 🔧 CORECT: folosește numele metodei din serviciu
        Optional<TipEchipamentPlaja> tipEchipamentOpt = service.getTipEchipamentById(id);

        if (tipEchipamentOpt.isPresent()) {
            TipEchipamentPlaja tipEchipament = tipEchipamentOpt.get();
            //tipEchipament.setActiv(false);
            
            // 🔧 CORECT: folosește metoda de ștergere din serviciu
            service.deleteTipEchipament(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}