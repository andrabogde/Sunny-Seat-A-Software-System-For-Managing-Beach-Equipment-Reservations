package com.example.fullstacktemplate.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fullstacktemplate.repository.PlajaRepository;
import com.example.fullstacktemplate.repository.StatisticsRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    @Autowired
    private PlajaRepository repository;
    // Helper method pentru conversie Object[] la Map
    private Map<String, Object> convertObjectArrayToMap(Object[] row, String[] keys) {
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < keys.length && i < row.length; i++) {
            map.put(keys[i], row[i]);
        }
        return map;
    }
    public Map<String, Object> getUserStatistics() {
        Map<String, Object> readOnlyResult = statisticsRepository.getUserStatistics();
        Map<String, Object> result = new HashMap<>(readOnlyResult);
    
        Long currentMonth = ((Number) result.get("utilizatoriNoiLunaAceasta")).longValue();
        Long lastMonth = ((Number) result.get("utilizatoriNoiLunaTrecuta")).longValue();
    
        if (lastMonth > 0) {
            double growthRate = ((currentMonth - lastMonth) * 100.0) / lastMonth;
            result.put("rataCrestere", Math.round(growthRate * 100.0) / 100.0);
        } else {
            result.put("rataCrestere", 0.0);
        }
    
        return result;
    }
    

    public Map<String, Object> getReservationStatistics() {
        Map<String, Object> originalResult = statisticsRepository.getReservationStatistics();
        Map<String, Object> result = new HashMap<>(originalResult); // copie modificabilă
    
        Long currentMonth = ((Number) result.get("rezervariLunaAceasta")).longValue();
        Long lastMonth = ((Number) result.get("rezervariLunaTrecuta")).longValue();
    
        if (lastMonth > 0) {
            double growthRate = ((currentMonth - lastMonth) * 100.0) / lastMonth;
            result.put("rataCrestereRezervari", Math.round(growthRate * 100.0) / 100.0);
        } else {
            result.put("rataCrestereRezervari", 0.0);
        }
    
        return result;
    }
    

    public List<Map<String, Object>> getTopActiveClients(int limit) {
        List<Object[]> results = statisticsRepository.getTopActiveClients(limit);
        String[] keys = {"numeClient", "email", "numarRezervari", "totalCheltuit", "ultimaRezervare"};
        
        return results.stream()
                .map(row -> convertObjectArrayToMap(row, keys))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getInactiveClients(int limit) {
        List<Object[]> results = statisticsRepository.getInactiveClients(limit);
        String[] keys = {"numeClient", "email", "ultimaRezervare", "zileDeLaUltimaRezervare"};
        
        return results.stream()
                .map(row -> convertObjectArrayToMap(row, keys))
                .collect(Collectors.toList());
    }

    // public List<Map<String, Object>> getTopBeachPerformance(int limit) {
    //     List<Object[]> results = statisticsRepository.getTopBeachPerformance(limit);
    //     String[] keys = {"numePlaja", "statiune", "numarRezervari", "venitTotal", "pretMediuRezervare"};
        
    //     return results.stream()
    //             .map(row -> convertObjectArrayToMap(row, keys))
    //             .collect(Collectors.toList());
    // }

    public List<Map<String, Object>> getEquipmentStatistics() {
        List<Object[]> results = statisticsRepository.getEquipmentStatistics();
        String[] keys = {"tipEchipament", "numarTotalEchipamente", "numarRezervari", "venitGenerat", "rataUtilizare"};
        
        return results.stream()
                .map(row -> convertObjectArrayToMap(row, keys))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSeasonalAnalysis() {
        List<Object[]> results = statisticsRepository.getSeasonalAnalysis();
        String[] keys = {"luna", "numarRezervari", "venitLunar"};
        
        return results.stream()
                .map(row -> convertObjectArrayToMap(row, keys))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getResortDistribution() {
        List<Object[]> results = statisticsRepository.getResortDistribution();
        String[] keys = {"statiune", "numarPlaje", "numarRezervari", "venitTotal"};
        
        return results.stream()
                .map(row -> convertObjectArrayToMap(row, keys))
                .collect(Collectors.toList());
    }

    // Metodă pentru a returna toate statisticile într-un singur apel
    public Map<String, Object> getAllStatistics() {
        Map<String, Object> allStats = new HashMap<>();
        
        allStats.put("userStatistics", getUserStatistics());
        allStats.put("reservationStatistics", getReservationStatistics());
        allStats.put("topActiveClients", getTopActiveClients(5));
        allStats.put("inactiveClients", getInactiveClients(5));
        allStats.put("beachPerformance", getTopBeachPerformance(5));
        allStats.put("equipmentStatistics", getEquipmentStatistics());
        allStats.put("seasonalAnalysis", getSeasonalAnalysis());
        allStats.put("resortDistribution", getResortDistribution());
        
        return allStats;
    }

       public List<Map<String, Object>> getTopBeachPerformance(int limit) {
        LocalDateTime dataInceput = LocalDateTime.now().minusMonths(12);
        LocalDateTime dataSfarsit = LocalDateTime.now();
        
        List<Object[]> results = repository.getTopBeachPerformance(dataInceput, dataSfarsit, limit);
        
        return results.stream()
                .map(row -> {
                    Map<String, Object> beach = new HashMap<>();
                    beach.put("nume_plaja", row[0]);
                    beach.put("statiune", row[1]);
                    beach.put("numar_rezervari", row[2]);
                    beach.put("venit_total", row[3]);
                    beach.put("pret_mediu_rezervare", row[4]);
                    return beach;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTopBeachPerformanceWithFilters(
            int ultimeleLuni, 
            Long stationId, 
            int minimRezervari, 
            int limit) {
        
        List<Object[]> results = repository.getTopBeachPerformanceWithFilters(
            ultimeleLuni, stationId, minimRezervari, limit);
        
        return results.stream()
                .map(row -> {
                    Map<String, Object> beach = new HashMap<>();
                    beach.put("plaja_id", row[0]);
                    beach.put("nume_plaja", row[1]);
                    beach.put("statiune", row[2]);
                    beach.put("numar_rezervari", row[3]);
                    beach.put("venit_total", row[4]);
                    beach.put("pret_mediu_rezervare", row[5]);
                    return beach;
                })
                .collect(Collectors.toList());
    }

}
