package com.example.fullstacktemplate.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalReservations;
    private long totalBeaches;
    private double totalRevenue;
    private long todayReservations;
    private long activeEquipment;
    private double userGrowth;
    private double revenueGrowth;
}




