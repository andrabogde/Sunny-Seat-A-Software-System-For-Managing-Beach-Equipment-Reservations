package com.example.fullstacktemplate.controller;


import com.example.fullstacktemplate.model.Poza;
import com.example.fullstacktemplate.service.PozaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/poze")
public class PozaController {

    private final PozaService service;

    @Autowired
    public PozaController(PozaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Poza> getAllPoze() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poza> getPozaById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/plaja/{plajaId}")
    public List<Poza> getPozeByPlajaId(@PathVariable Integer plajaId) {
        return service.findByPlajaId(plajaId);
    }

    @PostMapping
    public Poza createPoza(@RequestBody Poza poza) {
        poza.setCreatedAt(LocalDateTime.now());
        return service.save(poza);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Poza> updatePoza(@PathVariable Integer id, @RequestBody Poza updatedPoza) {
        return service.findById(id)
                .map(existingPoza -> {
                    existingPoza.setPlajaId(updatedPoza.getPlajaId());
                    existingPoza.setCaleImagine(updatedPoza.getCaleImagine());
                    existingPoza.setOrdine(updatedPoza.getOrdine());
                    service.save(existingPoza);
                    return ResponseEntity.ok(existingPoza);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoza(@PathVariable Integer id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

