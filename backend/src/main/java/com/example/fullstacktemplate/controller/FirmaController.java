package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.dto.FirmaDTO;
import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.service.FirmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "false")
@RequestMapping("/firme")
public class FirmaController {

    private final FirmaService service;

    @Autowired
    public FirmaController(FirmaService service) {
        this.service = service;
    }

    // // Adaugă acest handler pentru OPTIONS
    // @RequestMapping(method = RequestMethod.OPTIONS)
    // public ResponseEntity<Void> handleOptions() {
    //     return ResponseEntity.ok().build();
    // }

    @GetMapping
    public List<Firma> getAllFirme() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Firma> getFirmaById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @PostMapping
    // public Firma createFirma(@RequestBody Firma firma) {
    //     return service.save(firma);
    // }
    @PostMapping
    public ResponseEntity<?> createFirma(@RequestBody Firma firma) {
        try {
            System.out.println("🆕 Creating firma with data:");
            System.out.println("   Denumire: " + firma.getDenumire());
            System.out.println("   CUI: " + firma.getCui());
            System.out.println("   Email: " + firma.getEmail());
            System.out.println("   Telefon: " + firma.getTelefon());
            System.out.println("   Adresa: " + firma.getAdresa());
            System.out.println("   Activ: " + firma.getActiv());
            
            Firma savedFirma = service.save(firma);
            System.out.println("✅ Firma salvată cu ID: " + savedFirma.getId());
            
            return ResponseEntity.ok(savedFirma);
        } catch (Exception e) {
            System.err.println("❌ Eroare la salvarea firmei:");
            System.err.println("   Mesaj: " + e.getMessage());
            System.err.println("   Clasa: " + e.getClass().getSimpleName());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Firma> getFirmaByUserId(@PathVariable Integer id) {
        return ResponseEntity.ok(
            service.findByUserId(id).orElse(null)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFirma(@PathVariable Integer id, @RequestBody Firma updatedFirma) {


        return service.findById(id)
                .map(existingFirma -> {
                    if(!updatedFirma.getActiv()){
                        if(!service.hasActiveBookingsForFirma(id)){
                            service.inactivateBeachesForInactiveCompany(id);
                        }
                        else{
                            return ResponseEntity.status(400)
                            .body(Map.of("message","Nu putem dezactiva firma - are plaje cu rezervari active!!!"));
                        }                    
                    }
                    else{
                        service.activarePlajaPentruFirma(id);
                    }
                    existingFirma.setCui(updatedFirma.getCui());
                    existingFirma.setDenumire(updatedFirma.getDenumire());
                    existingFirma.setAdresa(updatedFirma.getAdresa());
                    existingFirma.setTelefon(updatedFirma.getTelefon());
                    existingFirma.setEmail(updatedFirma.getEmail());
                    existingFirma.setActiv(updatedFirma.getActiv());
                    service.save(existingFirma);
                    return ResponseEntity.ok(existingFirma);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Firma> patchFirma(
            @PathVariable Integer id,
            @RequestBody FirmaDTO patchDTO) {

        return service.findById(id)
                .map(existingFirma -> {
                    // Aplică modificările doar dacă sunt prezente în DTO
                    if (patchDTO.getCui() != null) {
                        existingFirma.setCui(patchDTO.getCui());
                    }
                    if (patchDTO.getDenumire() != null) {
                        existingFirma.setDenumire(patchDTO.getDenumire());
                    }
                    if (patchDTO.getAdresa() != null) {
                        existingFirma.setAdresa(patchDTO.getAdresa());
                    }
                    if (patchDTO.getTelefon() != null) {
                        existingFirma.setTelefon(patchDTO.getTelefon());
                    }
                    if (patchDTO.getEmail() != null) {
                        existingFirma.setEmail(patchDTO.getEmail());
                    }
                    if (patchDTO.getActiv() != null) {
                        existingFirma.setActiv(patchDTO.getActiv());
                    }

                    Firma savedFirma = service.save(existingFirma);
                    return ResponseEntity.ok(savedFirma);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Adaugă handler OPTIONS specific pentru ID
// Înlocuiește handler-ul OPTIONS existent cu acesta îmbunătățit:
@RequestMapping(method = RequestMethod.OPTIONS)
public ResponseEntity<?> handleOptions() {
    System.out.println("🔧 OPTIONS request received!");
    return ResponseEntity.ok()
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            .header("Access-Control-Allow-Headers", "*")
            .build();
}

@RequestMapping(value = "/{id}", method = RequestMethod.OPTIONS)
public ResponseEntity<?> handleOptionsWithId(@PathVariable Integer id) {
    System.out.println("🔧 OPTIONS request received for ID: " + id);
    return ResponseEntity.ok()
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            .header("Access-Control-Allow-Headers", "*")
            .build();
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteFirma(@PathVariable Integer id) {
    System.out.println("🗑️ DELETE request received for ID: " + id);
    System.out.println("📍 Request headers available");
    
    if (service.findById(id).isPresent()) {
        service.deleteById(id);
        System.out.println("✅ Firma deleted successfully");
        return ResponseEntity.noContent().build();
    } else {
        System.out.println("❌ Firma not found");
        return ResponseEntity.notFound().build();
    }
}
}