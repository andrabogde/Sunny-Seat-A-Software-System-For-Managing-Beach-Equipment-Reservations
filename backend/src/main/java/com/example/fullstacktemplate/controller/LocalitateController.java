package com.example.fullstacktemplate.controller;

import com.example.fullstacktemplate.model.Localitate;
import com.example.fullstacktemplate.service.LocalitateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;


@RestController
@RequestMapping("/api/localitati") // ✅ CORECTEZ PATH-UL
@CrossOrigin(origins = {"http://localhost:4000", "http://localhost:3000"}, 
            allowedHeaders = "*",
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                      RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LocalitateController {

    private final LocalitateService service;

    public LocalitateController(LocalitateService service) {
        this.service = service;
    }

   @GetMapping
public ResponseEntity<List<Map<String, Object>>> getAllLocalitati() {
    System.out.println("🏘️ Getting all localitati...");
    List<Localitate> localitati = service.findAll();
    System.out.println("📍 Found " + localitati.size() + " localitati");
    
    // ✅ Convertește la DTO-uri simple pentru a evita circular references
    List<Map<String, Object>> simplifiedLocalitati = localitati.stream().map(localitate -> {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", localitate.getId());
        dto.put("denumire", localitate.getDenumire());
        // Nu includem tara pentru a evita circular references
        // dto.put("tip", localitate.getTip()); // Ignor enum-ul conform cererii
        return dto;
    }).collect(Collectors.toList());
    
    return ResponseEntity.ok(simplifiedLocalitati);
}

    @GetMapping("/{id}")
    public ResponseEntity<Localitate> getLocalitateById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Opțional: filtrare după țară
    @GetMapping("/tara/{taraId}")
    public ResponseEntity<List<Localitate>> getLocalitatiByTara(@PathVariable Integer taraId) {
        System.out.println("🌍 Getting localitati for tara ID: " + taraId);
        List<Localitate> localitati = service.findByTaraId(taraId);
        return ResponseEntity.ok(localitati);
    }

    // Handler pentru OPTIONS
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build();
    }
}