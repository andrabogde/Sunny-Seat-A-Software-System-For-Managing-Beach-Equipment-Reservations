package com.example.fullstacktemplate.controller;
import com.example.fullstacktemplate.dto.StatiuneDTO;
import com.example.fullstacktemplate.model.Statiune;
import com.example.fullstacktemplate.service.StatiuneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/statiuni")
public class StatiuneController {

    private final StatiuneService statiuneService;

    @Autowired
    public StatiuneController(StatiuneService statiuneService) {
        this.statiuneService = statiuneService;
    }

    @GetMapping
    public List<Statiune> getAllStatiuni() {
        return statiuneService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Statiune> getStatiuneById(@PathVariable Integer id) {
        return statiuneService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Statiune createStatiune(@RequestBody Statiune statiune) {
        return statiuneService.save(statiune);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Statiune> updateStatiune(@PathVariable Integer id, @RequestBody Statiune updatedStatiune) {
        return statiuneService.findById(id)
                .map(existingStatiune -> {
                    existingStatiune.setDenumire(updatedStatiune.getDenumire());
                    existingStatiune.setLatitudine(updatedStatiune.getLatitudine());
                    existingStatiune.setLongitudine(updatedStatiune.getLongitudine());
                    statiuneService.save(existingStatiune);
                    return ResponseEntity.ok(existingStatiune);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PatchMapping("/{id}")
public ResponseEntity<Statiune> patchStatiune(
        @PathVariable Integer id,
        @RequestBody StatiuneDTO patchDTO) {

    return statiuneService.findById(id)
            .map(existingStatiune -> {
                // Aplică modificările doar dacă sunt prezente în DTO
                if (patchDTO.getDenumire() != null) {
                    existingStatiune.setDenumire(patchDTO.getDenumire());
                }
                if (patchDTO.getLatitudine() != null) {
                    existingStatiune.setLatitudine(patchDTO.getLatitudine());
                }
                if (patchDTO.getLongitudine() != null) {
                    existingStatiune.setLongitudine(patchDTO.getLongitudine());
                }

                return ResponseEntity.ok(statiuneService.save(existingStatiune));
            })
            .orElse(ResponseEntity.notFound().build());
}


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatiune(@PathVariable Integer id) {
        if (statiuneService.findById(id).isPresent()) {
            statiuneService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

