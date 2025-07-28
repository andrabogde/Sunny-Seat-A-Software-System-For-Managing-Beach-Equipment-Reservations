package com.example.fullstacktemplate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EquipmentPriceDTO {
    private Integer pretId;
    private Integer echipamentPlajaId;
    private Integer valoare;
    private LocalDateTime dataOra;

    private String plajaDenumire;
    private String firmaNume;
    private String statiuneNume;
    private String echipamentDenumire;
    private String tipEchipamentNume;

    private Integer pozitioLinie;
    private Integer pozitioColoana;

    private Integer plajaId;
    private Integer tipEchipamentId;
    private Integer firmaId;
    private Integer statiuneId;
}
