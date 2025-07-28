package com.example.fullstacktemplate.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RezervareResponseDTO {
    private Integer id;
    private String codRezervare;
    private UtilizatorSimpleDTO utilizator;
    private String stareRezervare;
    private String plaja;
    private LocalDate dataInceput;
    private LocalDate dataSfarsit;
    private Double pretBucata;
    private Integer cantitate;
    private Double pretTotal;
    private LocalDateTime createdAt;
    private Integer userId;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UtilizatorSimpleDTO {
        private Long id;
        private String name;
        private String email;
    }
}
