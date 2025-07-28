package com.example.fullstacktemplate.controller;
import com.example.fullstacktemplate.model.StareRezervare;
import com.example.fullstacktemplate.service.StareRezervareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stari-rezervari")
public class StareRezervareController {

    @Autowired
    private StareRezervareService stareRezervareService;

    @GetMapping
    public List<StareRezervare> getAllStariRezervari() {
        return stareRezervareService.getAllStariRezervari();
    }

    @GetMapping("/{id}")
public ResponseEntity<StareRezervare> getStareRezervareById(@PathVariable Integer id) {
    return stareRezervareService.getStareRezervareById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@PostMapping
public StareRezervare createStareRezervare(@RequestBody StareRezervare stareRezervare) {
    return stareRezervareService.saveStareRezervare(stareRezervare);
}

@PutMapping("/{id}")
public ResponseEntity<StareRezervare> updateStareRezervare(
        @PathVariable Integer id, @RequestBody StareRezervare updatedStareRezervare) {
    return stareRezervareService.getStareRezervareById(id)
            .map(existingStareRezervare -> {
                updatedStareRezervare.setId(id);
                return ResponseEntity.ok(stareRezervareService.saveStareRezervare(updatedStareRezervare));
            })
            .orElse(ResponseEntity.notFound().build());
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteStareRezervare(@PathVariable Integer id) {
    if (stareRezervareService.getStareRezervareById(id).isPresent()) {
        stareRezervareService.deleteStareRezervare(id);
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
}
}

