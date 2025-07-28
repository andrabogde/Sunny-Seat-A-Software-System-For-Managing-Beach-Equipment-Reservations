package com.example.fullstacktemplate.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fullstacktemplate.dto.DashboardAlertDTO;
import com.example.fullstacktemplate.dto.DashboardStatsDTO;
import com.example.fullstacktemplate.dto.RecentReservationDTO;
import com.example.fullstacktemplate.service.DashboardService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminDashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Obține statisticile principale pentru dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            log.info("📊 Request pentru statistici dashboard");
            
            DashboardStatsDTO stats = dashboardService.getDashboardStatistics();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "totalUsers", stats.getTotalUsers(),
                "totalReservations", stats.getTotalReservations(),
                "totalBeaches", stats.getTotalBeaches(),
                "totalRevenue", stats.getTotalRevenue(),
                "todayReservations", stats.getTodayReservations(),
                "activeEquipment", stats.getActiveEquipment(),
                "userGrowth", stats.getUserGrowth(),
                "revenueGrowth", stats.getRevenueGrowth()
            ));
            
        } catch (Exception e) {
            log.error("❌ Eroare la obținerea statisticilor dashboard: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Eroare la încărcarea statisticilor"));
        }
    }

    /**
     * Obține rezervările recente
     */
    @GetMapping("/recent-reservations")
    public ResponseEntity<?> getRecentReservations(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            log.info("📋 Request pentru rezervări recente (limit: {})", limit);
            
            List<RecentReservationDTO> reservations = dashboardService.getRecentReservations(limit);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "reservations", reservations,
                "count", reservations.size()
            ));
            
        } catch (Exception e) {
            log.error("❌ Eroare la obținerea rezervărilor recente: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Eroare la încărcarea rezervărilor"));
        }
    }

    /**
     * Obține alertele și notificările
     */
    @GetMapping("/alerts")
    public ResponseEntity<?> getDashboardAlerts() {
        try {
            log.info("🔔 Request pentru alerte dashboard");
            
            List<DashboardAlertDTO> alerts = dashboardService.getDashboardAlerts();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "alerts", alerts,
                "count", alerts.size()
            ));
            
        } catch (Exception e) {
            log.error("❌ Eroare la obținerea alertelor: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Eroare la încărcarea alertelor"));
        }
    }
}