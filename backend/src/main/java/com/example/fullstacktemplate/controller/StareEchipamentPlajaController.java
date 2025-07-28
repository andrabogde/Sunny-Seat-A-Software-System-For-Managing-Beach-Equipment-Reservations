package com.example.fullstacktemplate.controller;



import com.example.fullstacktemplate.dto.StareEchipamentPlajaDTO;
import com.example.fullstacktemplate.model.StareEchipamentPlaja;
import com.example.fullstacktemplate.service.StareEchipamentPlajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stari-echipamente-plaja")
public class StareEchipamentPlajaController {

    private final StareEchipamentPlajaService service;

    @Autowired
    public StareEchipamentPlajaController(StareEchipamentPlajaService service) {
        this.service = service;
    }

    @GetMapping
    public List<StareEchipamentPlaja> getAllStariEchipamentePlaja() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StareEchipamentPlaja> getStareEchipamentPlajaById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public StareEchipamentPlaja createStareEchipamentPlaja(@RequestBody StareEchipamentPlaja stareEchipamentPlaja) {
        return service.save(stareEchipamentPlaja);
    }

 @PatchMapping("/{id}")
    public ResponseEntity<StareEchipamentPlaja> actualizeazaPartial(
            @PathVariable Integer id, 
            @RequestBody StareEchipamentPlajaDTO dto) {

        Optional<StareEchipamentPlaja> optionalEchipament = service.findById(id);
        if (!optionalEchipament.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        StareEchipamentPlaja echipament = optionalEchipament.get();

        if (dto.getDenumire() != null) {
            echipament.setDenumire(dto.getDenumire());
        }
       

        service.save(echipament);
        return ResponseEntity.ok(echipament);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StareEchipamentPlaja> updateStareEchipamentPlaja(@PathVariable Integer id, @RequestBody StareEchipamentPlaja updatedStare) {
        return service.findById(id)
                .map(existingStare -> {
                    existingStare.setDenumire(updatedStare.getDenumire());
                    //existingStare.setActiv(updatedStare.getActiv());
                    service.save(existingStare);
                    return ResponseEntity.ok(existingStare);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStareEchipamentPlaja(@PathVariable Integer id) {
        StareEchipamentPlaja stareEchipamentPlaja = service.findById(id).orElse(null);
        if (stareEchipamentPlaja != null) {
           // stareEchipamentPlaja.setActiv(false);
            service.save(stareEchipamentPlaja);
            //service.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
