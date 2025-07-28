package com.example.fullstacktemplate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAlertDTO {
    private String type; // "info", "warning", "danger", "success"
    private String title;
    private String message;
    private long count;
}    