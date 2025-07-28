package com.example.fullstacktemplate.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentReservationDTO {
    private String id;
    private String userName;
    private String beachName;
    private LocalDateTime createdAt;
    private String status;
    private BigDecimal totalAmount;
}