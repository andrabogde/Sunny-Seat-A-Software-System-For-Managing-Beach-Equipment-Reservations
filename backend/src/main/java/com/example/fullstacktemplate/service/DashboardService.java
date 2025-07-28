package com.example.fullstacktemplate.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fullstacktemplate.dto.DashboardAlertDTO;
import com.example.fullstacktemplate.dto.DashboardStatsDTO;
import com.example.fullstacktemplate.dto.RecentReservationDTO;
import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.repository.EchipamentPlajaRepository;
import com.example.fullstacktemplate.repository.PlajaRepository;
import com.example.fullstacktemplate.repository.RezervareRepository;
import com.example.fullstacktemplate.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@Slf4j
public class DashboardService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RezervareRepository rezervareRepository;
    
    @Autowired
    private PlajaRepository beachRepository;
    
    @Autowired
    private EchipamentPlajaRepository echipamentRepository;

    /**
     * Calculează toate statisticile pentru dashboard
     */
    public DashboardStatsDTO getDashboardStatistics() {
        log.info("📊 Calculare statistici dashboard...");
        
        try {
            // Statistici de bază
            long totalUsers = userRepository.count();
            long totalReservations = rezervareRepository.countActiveReservations();
            long totalBeaches = beachRepository.count();
            BigDecimal totalRevenue = rezervareRepository.calculateTotalRevenue();
            long todayReservations = rezervareRepository.countTodayReservations();
            long activeEquipment = echipamentRepository.countActiveEquipment();
            
            // Calculează creșterea utilizatorilor (ultima lună vs luna precedentă)
            double userGrowth = calculateUserGrowth();
            
            // Calculează creșterea veniturilor (ultima lună vs luna precedentă)
            double revenueGrowth = calculateRevenueGrowth();
            
            DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalReservations(totalReservations)
                .totalBeaches(totalBeaches)
                .totalRevenue(totalRevenue != null ? totalRevenue.doubleValue() : 0.0)
                .todayReservations(todayReservations)
                .activeEquipment(activeEquipment)
                .userGrowth(userGrowth)
                .revenueGrowth(revenueGrowth)
                .build();
            
            log.info("✅ Statistici calculate: {}", stats);
            return stats;
            
        } catch (Exception e) {
            log.error("❌ Eroare la calcularea statisticilor: {}", e.getMessage(), e);
            throw new RuntimeException("Eroare la calcularea statisticilor dashboard");
        }
    }

    /**
     * Obține rezervările recente
     */
    public List<RecentReservationDTO> getRecentReservations(int limit) {
        log.info("📋 Obținere rezervări recente (limit: {})", limit);
        
        try {
            List<Rezervare> rezervari = rezervareRepository.findRecentReservations(PageRequest.of(0, limit));
            
            return rezervari.stream()
                .map(this::mapToRecentReservationDTO)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("❌ Eroare la obținerea rezervărilor recente: {}", e.getMessage(), e);
            throw new RuntimeException("Eroare la obținerea rezervărilor recente");
        }
    }

    /**
     * Obține alertele pentru dashboard
     */
    public List<DashboardAlertDTO> getDashboardAlerts() {
        log.info("🔔 Obținere alerte dashboard");
        
        List<DashboardAlertDTO> alerts = new ArrayList<>();
        
        try {
            // Verifică rezervări care expiră în curând
            long expiringReservations = rezervareRepository.countExpiringReservations(LocalDateTime.now().plusHours(24));
            if (expiringReservations > 0) {
                alerts.add(DashboardAlertDTO.builder()
                    .type("warning")
                    .title("Rezervări în curs de expirare")
                    .message(String.format("%d rezervări expiră în următoarele 24 ore", expiringReservations))
                    .count(expiringReservations)
                    .build());
            }
            
            // Verifică echipamente cu probleme
            long problematicEquipment = echipamentRepository.countProblematicEquipment();
            if (problematicEquipment > 0) {
                alerts.add(DashboardAlertDTO.builder()
                    .type("danger")
                    .title("Echipamente cu probleme")
                    .message(String.format("%d echipamente necesită atenție", problematicEquipment))
                    .count(problematicEquipment)
                    .build());
            }
            
            // Verifică cereri de manager în așteptare
            long pendingManagerRequests = 5; // Înlocuiește cu query real
            if (pendingManagerRequests > 0) {
                alerts.add(DashboardAlertDTO.builder()
                    .type("info")
                    .title("Cereri manager în așteptare")
                    .message(String.format("%d cereri necesită aprobare", pendingManagerRequests))
                    .count(pendingManagerRequests)
                    .build());
            }
            
            log.info("✅ Alerte obținute: {}", alerts.size());
            return alerts;
            
        } catch (Exception e) {
            log.error("❌ Eroare la obținerea alertelor: {}", e.getMessage(), e);
            return alerts; // Returnează lista parțială în caz de eroare
        }
    }

    /**
     * Calculează creșterea utilizatorilor
     */
    private double calculateUserGrowth() {
        try {
            LocalDateTime startOfCurrentMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);
            
            long currentMonthUsers = userRepository.countUsersCreatedBetween(startOfCurrentMonth, LocalDateTime.now());
            long previousMonthUsers = userRepository.countUsersCreatedBetween(startOfPreviousMonth, startOfCurrentMonth);
            
            if (previousMonthUsers == 0) {
                return currentMonthUsers > 0 ? 100.0 : 0.0;
            }
            
            return ((double) (currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100.0;
            
        } catch (Exception e) {
            log.warn("⚠️ Eroare la calcularea creșterii utilizatorilor: {}", e.getMessage());
            return 0.0;
        }
    }

    /**
     * Calculează creșterea veniturilor
     */
    private double calculateRevenueGrowth() {
        try {
            LocalDateTime startOfCurrentMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);
            List<Rezervare> currentMonthRevenue = rezervareRepository.findAllByDataRezervareBetweenAndStareRezervare(startOfCurrentMonth, LocalDateTime.now(),"CONFIRMATA");

BigDecimal totalcurrentMonthRevenue = new BigDecimal(currentMonthRevenue.stream()
    .mapToDouble(Rezervare::getTotalCalculatDinLinii)
    .sum());
    List<Rezervare> previousMonthRevenue = rezervareRepository.findAllByDataRezervareBetweenAndStareRezervare(startOfPreviousMonth, startOfCurrentMonth,"CONFIRMATA");
    BigDecimal totalpreviousMonthRevenue = new BigDecimal(previousMonthRevenue.stream()
    .mapToDouble(Rezervare::getTotalCalculatDinLinii)
    .sum());
            
            if (totalpreviousMonthRevenue == null || totalpreviousMonthRevenue.compareTo(BigDecimal.ZERO) == 0) {
                return totalcurrentMonthRevenue != null && totalcurrentMonthRevenue.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
            }
            
            if (totalcurrentMonthRevenue == null) {
                totalcurrentMonthRevenue = BigDecimal.ZERO;
            }
            
            BigDecimal growth = totalcurrentMonthRevenue.subtract(totalpreviousMonthRevenue)
                .divide(totalpreviousMonthRevenue, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
                
            return growth.doubleValue();
            
        } catch (Exception e) {
            log.warn("⚠️ Eroare la calcularea creșterii veniturilor: {}", e.getMessage());
            return 0.0;
        }
    }

    /**
     * Mapează Rezervare la RecentReservationDTO
     */
    private RecentReservationDTO mapToRecentReservationDTO(Rezervare rezervare) {
        return RecentReservationDTO.builder()
            .id(rezervare.getId().toString())
            .userName(rezervare.getUtilizator().getFullName())
            .beachName(rezervare.getLinii().get(0).getEchipament().getPlaja().getDenumire())
            .createdAt(rezervare.getCreatedAt())
            .status(rezervare.getStareRezervare())
            .totalAmount(new BigDecimal(rezervare.getTotalCalculatDinLinii()))
            .build();
    }
}
