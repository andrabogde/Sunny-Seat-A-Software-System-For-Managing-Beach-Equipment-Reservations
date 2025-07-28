package com.example.fullstacktemplate.dto;

import java.time.LocalDateTime;

public class PretDTO {
    
    private Integer id;
    private Integer echipamentPlajaId;
    private Integer valoare;
    private LocalDateTime dataOra;

    // Constructor implicit
    public PretDTO() {}

    // Constructor complet (folosit în controller)
    public PretDTO(Integer id, Integer echipamentPlajaId, Integer valoare, LocalDateTime dataOra) {
        this.id = id;
        this.echipamentPlajaId = echipamentPlajaId;
        this.valoare = valoare;
        this.dataOra = dataOra;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEchipamentPlajaId() {
        return echipamentPlajaId;
    }

    public void setEchipamentPlajaId(Integer echipamentPlajaId) {
        this.echipamentPlajaId = echipamentPlajaId;
    }

    public Integer getValoare() {
        return valoare;
    }

    public void setValoare(Integer valoare) {
        this.valoare = valoare;
    }

    public LocalDateTime getDataOra() {
        return dataOra;
    }

    public void setDataOra(LocalDateTime dataOra) {
        this.dataOra = dataOra;
    }

    @Override
    public String toString() {
        return "PretDTO{" +
                "id=" + id +
                ", echipamentPlajaId=" + echipamentPlajaId +
                ", valoare=" + valoare +
                ", dataOra=" + dataOra +
                '}';
    }
}