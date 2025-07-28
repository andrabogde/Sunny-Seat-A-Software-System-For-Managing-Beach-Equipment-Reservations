package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.PlajaDTO;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.service.PlaceDetailsService;
import com.example.fullstacktemplate.service.PlajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/plaje")
public class PlajaController {

    private final PlajaService service;
    private final PlaceDetailsService placeDetailsService;

    @Autowired
    public PlajaController(PlajaService service, PlaceDetailsService placeDetailsService) {
        this.placeDetailsService = placeDetailsService;
        this.service = service;
    }

    @GetMapping("/user")
    public List<Plaja> getAllPlajeByUser(Principal principal) {
        String username = principal.getName();
        return service.findByUserEmail(username);
    }

    @GetMapping
    public List<Plaja> getAllPlaje() {
        return service.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Plaja> getPlajaById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/activ/{activ}")
    public List<Plaja> getPlajeByActiv(@PathVariable Boolean activ) {
        return service.findByActiv(activ);
    }

    @GetMapping("/statiune/{statiuneId}")
    public List<Plaja> getPlajeByStatiuneId(@PathVariable Integer statiuneId) {
        return service.findByStatiuneId(statiuneId);
    }

    @PostMapping
public Plaja createPlaja(@RequestBody Plaja plaja) {
    // DEBUG: Log payload-ul primit
    System.out.println("=== CREATE PLAJA DEBUG ===");
    System.out.println("Payload primit: " + plaja);
    System.out.println("Denumire: " + plaja.getDenumire());
    System.out.println("Descriere: " + plaja.getDescriere());
    System.out.println("Adresa: " + plaja.getAdresa());
    System.out.println("NumarSezlonguri: " + plaja.getNumarSezlonguri());
    System.out.println("Latitudine: " + plaja.getLatitudine());
    System.out.println("Longitudine: " + plaja.getLongitudine());
    System.out.println("Activ: " + plaja.getActiv());
    System.out.println("Firma ID: " + (plaja.getFirma() != null ? plaja.getFirma().getId() : "NULL"));
    System.out.println("Statiune ID: " + (plaja.getStatiune() != null ? plaja.getStatiune().getId() : "NULL"));
    System.out.println("DetaliiWeb: " + plaja.getDetaliiWeb());
    
    // Validare și conversie BigDecimal pentru coordonate
    if (plaja.getLatitudine() == null) {
        System.out.println("⚠️ WARNING: Latitudine este NULL, setez default 0.0");
        plaja.setLatitudine(BigDecimal.ZERO);
    }
    if (plaja.getLongitudine() == null) {
        System.out.println("⚠️ WARNING: Longitudine este NULL, setez default 0.0");
        plaja.setLongitudine(BigDecimal.ZERO);
    }
    if (plaja.getNumarSezlonguri() == null) {
        System.out.println("⚠️ WARNING: NumarSezlonguri este NULL, setez default 0");
        plaja.setNumarSezlonguri(0);
    }
    if (plaja.getActiv() == null) {
        System.out.println("⚠️ WARNING: Activ este NULL, setez default true");
        plaja.setActiv(true);
    }
    
    System.out.println("=== DUPĂ VALIDARE ===");
    System.out.println("Latitudine finală: " + plaja.getLatitudine());
    System.out.println("Longitudine finală: " + plaja.getLongitudine());
    
    // 🚀 SAVE PLAJA FIRST
    Plaja savedPlaja = service.save(plaja);
    System.out.println("✅ Plaja salvată cu ID: " + savedPlaja.getId());
    
    // 🌐 FETCH WEB DETAILS AUTOMATICALLY
    System.out.println("🔍 Fetching web details for: " + savedPlaja.getDenumire());
    try {
        // Construiește query-ul pentru căutarea pe Google Places API
        String searchQuery = savedPlaja.getDenumire();
        if (savedPlaja.getAdresa() != null && !savedPlaja.getAdresa().isEmpty()) {
            searchQuery += " " + savedPlaja.getAdresa();
        }
        if (savedPlaja.getStatiune() != null && savedPlaja.getStatiune().getDenumire() != null) {
            searchQuery += " " + savedPlaja.getStatiune().getDenumire();
        }
        
        System.out.println("🔍 Search query: " + searchQuery);
        
        // Fetch place details
        Map<String, Object> placeDetails = placeDetailsService.getPlaceDetails(searchQuery);
        
        if (placeDetails != null && !placeDetails.isEmpty()) {
            System.out.println("✅ Web details found: " + placeDetails);
            
            // ✅ CORRECȚIE: Merge existing detaliiWeb with new data
            Map<String, Object> currentDetails = savedPlaja.getDetaliiWeb();
            if (currentDetails != null && !currentDetails.isEmpty()) {
                // Păstrează datele existente și adaugă cele noi
                currentDetails.putAll(placeDetails);
                savedPlaja.setDetaliiWeb(currentDetails);
                System.out.println("🔄 Merged with existing details");
            } else {
                // Nu există date existente, folosește doar datele noi
                savedPlaja.setDetaliiWeb(placeDetails);
                System.out.println("🆕 Set new details");
            }
            
            savedPlaja = service.save(savedPlaja); // Save updated plaja
            
            System.out.println("🎉 Plaja updated with web details!");
        } else {
            System.out.println("⚠️ No web details found for: " + searchQuery);
        }
        
    } catch (Exception e) {
        System.out.println("❌ Error fetching web details: " + e.getMessage());
        e.printStackTrace();
        // Don't fail the whole operation if web details fail
    }
    
    System.out.println("========================");
    return savedPlaja;
}
    @PatchMapping("/{id}")
    public ResponseEntity<Plaja> patchPlaja(
            @PathVariable Integer id, 
            @RequestBody PlajaDTO patchDTO) {
    
        return service.findById(id)
                .map(existingPlaja -> {
                    // Aplică modificările doar dacă sunt prezente în DTO
                    if (patchDTO.getFirmaId() != null) {
                        existingPlaja.getFirma().setId(patchDTO.getFirmaId());
                    }
                    if (patchDTO.getStatiuneId() != null) {
                        existingPlaja.getStatiune().setId(patchDTO.getStatiuneId());
                    }
                    if (patchDTO.getDenumire() != null) {
                        existingPlaja.setDenumire(patchDTO.getDenumire());
                    }
                    if (patchDTO.getDescriere() != null) {
                        existingPlaja.setDescriere(patchDTO.getDescriere());
                    }
                    if (patchDTO.getNumarSezlonguri() != null) {
                        existingPlaja.setNumarSezlonguri(patchDTO.getNumarSezlonguri());
                    }
                    if (patchDTO.getActiv() != null) {
                        existingPlaja.setActiv(patchDTO.getActiv());
                    }
    
                    return ResponseEntity.ok(service.save(existingPlaja));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plaja> updatePlaja(@PathVariable Integer id, @RequestBody Plaja updatedPlaja) {
        System.out.println("=== UPDATE PLAJA PUT ===");
        System.out.println("updatedPlaja.getFirma(): " + updatedPlaja.getFirma());
        System.out.println("updatedPlaja.getStatiune(): " + updatedPlaja.getStatiune());
        System.out.println("updatedPlaja.getLatitudine(): " + updatedPlaja.getLatitudine());
        System.out.println("updatedPlaja.getLongitudine(): " + updatedPlaja.getLongitudine());
        
        return service.findById(id)
                .map(existingPlaja -> {
                    // NU actualiza relațiile dacă sunt null în request
                    if (updatedPlaja.getFirma() != null) {
                        existingPlaja.setFirma(updatedPlaja.getFirma());
                    }
                    if (updatedPlaja.getStatiune() != null) {
                        existingPlaja.setStatiune(updatedPlaja.getStatiune());
                    }
                    if (updatedPlaja.getDenumire() != null) {
                        existingPlaja.setDenumire(updatedPlaja.getDenumire());
                    }
                    if (updatedPlaja.getDescriere() != null) {
                        existingPlaja.setDescriere(updatedPlaja.getDescriere());
                    }
                    if (updatedPlaja.getAdresa() != null) {
                        existingPlaja.setAdresa(updatedPlaja.getAdresa());
                    }
                    if (updatedPlaja.getNumarSezlonguri() != null) {
                        existingPlaja.setNumarSezlonguri(updatedPlaja.getNumarSezlonguri());
                    }
                    if (updatedPlaja.getLatitudine() != null) {
                        existingPlaja.setLatitudine(updatedPlaja.getLatitudine());
                    }
                    if (updatedPlaja.getLongitudine() != null) {
                        existingPlaja.setLongitudine(updatedPlaja.getLongitudine());
                    }
                    if (updatedPlaja.getActiv() != null) {
                        existingPlaja.setActiv(updatedPlaja.getActiv());
                    }
                    
                    service.save(existingPlaja);
                    return ResponseEntity.ok(existingPlaja);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaja(@PathVariable Integer id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🆕 ENDPOINT MANUAL PENTRU REFRESH WEB DETAILS
    @PostMapping("/{id}/refresh-details")
    public ResponseEntity<Plaja> refreshPlaceDetails(@PathVariable Integer id) {
        Optional<Plaja> plajaOptional = service.findById(id);
        
        if (!plajaOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Plaja plaja = plajaOptional.get();
        
        try {
            String searchQuery = plaja.getDenumire();
            
            if (plaja.getAdresa() != null) {
                searchQuery += " " + plaja.getAdresa();
            }
            
            if (plaja.getStatiune() != null && plaja.getStatiune().getDenumire() != null) {
                searchQuery += " " + plaja.getStatiune().getDenumire();
            }
            
            System.out.println("🔍 Refreshing details for: " + searchQuery);
            
            Map<String, Object> placeDetails = placeDetailsService.getPlaceDetails(searchQuery);
            
            if (placeDetails != null && !placeDetails.isEmpty()) {
                plaja.setDetaliiWeb(placeDetails);
                Plaja updated = service.save(plaja);
                System.out.println("✅ Details refreshed successfully");
                return ResponseEntity.ok(updated);
            } else {
                System.out.println("⚠️ No details found");
                return ResponseEntity.noContent().build();
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error refreshing details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}