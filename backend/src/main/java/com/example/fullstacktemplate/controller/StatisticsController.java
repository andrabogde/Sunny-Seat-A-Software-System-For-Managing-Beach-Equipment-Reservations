package com.example.fullstacktemplate.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.fullstacktemplate.service.StatisticsService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class StatisticsController {

    private final StatisticsService statisticsService;

    // Statistici utilizatori
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        return ResponseEntity.ok(statisticsService.getUserStatistics());
    }

    // Statistici rezervări
    @GetMapping("/reservations")
    public ResponseEntity<Map<String, Object>> getReservationStatistics() {
        return ResponseEntity.ok(statisticsService.getReservationStatistics());
    }

    // Top clienți activi
    @GetMapping("/clients/top-active")
    public ResponseEntity<List<Map<String, Object>>> getTopActiveClients(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(statisticsService.getTopActiveClients(limit));
    }

    // Clienți inactivi
    @GetMapping("/clients/inactive")
    public ResponseEntity<List<Map<String, Object>>> getInactiveClients(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(statisticsService.getInactiveClients(limit));
    }

    // // Performanța plajelor
    // @GetMapping("/beaches/performance")
    // public ResponseEntity<List<Map<String, Object>>> getBeachPerformance(
    //         @RequestParam(defaultValue = "10") int limit) {
    //     return ResponseEntity.ok(statisticsService.getTopBeachPerformance(limit));
    // }

    // Statistici echipamente
    @GetMapping("/equipment")
    public ResponseEntity<List<Map<String, Object>>> getEquipmentStatistics() {
        return ResponseEntity.ok(statisticsService.getEquipmentStatistics());
    }

    // Analiza sezonieră
    @GetMapping("/seasonal")
    public ResponseEntity<List<Map<String, Object>>> getSeasonalAnalysis() {
        return ResponseEntity.ok(statisticsService.getSeasonalAnalysis());
    }

    // Distribuția pe stațiuni
    @GetMapping("/resorts")
    public ResponseEntity<List<Map<String, Object>>> getResortDistribution() {
        return ResponseEntity.ok(statisticsService.getResortDistribution());
    }

    // TOATE statisticile într-un singur endpoint
    @GetMapping("/complete")
    public ResponseEntity<Map<String, Object>> getAllStatistics() {
        return ResponseEntity.ok(statisticsService.getAllStatistics());
    }


      // Endpoint simplu pentru top plaje
      @GetMapping("/beaches/performance")
      public ResponseEntity<List<Map<String, Object>>> getBeachPerformance(
              @RequestParam(defaultValue = "10") int limit) {
          
          List<Map<String, Object>> performance = statisticsService.getTopBeachPerformance(limit);
          return ResponseEntity.ok(performance);
      }
  
      // Endpoint cu filtre avansate
      @GetMapping("/beaches/performance/advanced")
      public ResponseEntity<List<Map<String, Object>>> getBeachPerformanceAdvanced(
              @RequestParam(defaultValue = "12") int ultimeleLuni,
              @RequestParam(required = false) Long stationId,
              @RequestParam(defaultValue = "1") int minimRezervari,
              @RequestParam(defaultValue = "10") int limit,
              @RequestParam(defaultValue = "rezervari") String sortBy) {
          
          List<Map<String, Object>> performance = statisticsService
              .getTopBeachPerformanceWithFilters(ultimeleLuni, stationId, minimRezervari, limit);
          
          return ResponseEntity.ok(performance);
      }
  
      // Endpoint pentru o anumită stațiune
      @GetMapping("/beaches/performance/station/{stationId}")
      public ResponseEntity<List<Map<String, Object>>> getBeachPerformanceByStation(
              @PathVariable Long stationId,
              @RequestParam(defaultValue = "10") int limit) {
          
          List<Map<String, Object>> performance = statisticsService
              .getTopBeachPerformanceWithFilters(12, stationId, 1, limit);
          
          return ResponseEntity.ok(performance);
      }

}