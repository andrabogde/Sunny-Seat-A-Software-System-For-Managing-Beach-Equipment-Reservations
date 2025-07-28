package com.example.fullstacktemplate.dto;

import java.math.BigDecimal;

public class PlajaDTO {
    private Integer firmaId;
    private Integer statiuneId;
    private String denumire;
    private String descriere;
    private Integer numarSezlonguri;
    
    // ✅ ADD MISSING COORDINATE FIELDS
    private BigDecimal latitudine;
    private BigDecimal longitudine;
    
    private Boolean activ;

    // Getters și Setters
    public Integer getFirmaId() { return firmaId; }
    public void setFirmaId(Integer firmaId) { this.firmaId = firmaId; }

    public Integer getStatiuneId() { return statiuneId; }
    public void setStatiuneId(Integer statiuneId) { this.statiuneId = statiuneId; }

    public String getDenumire() { return denumire; }
    public void setDenumire(String denumire) { this.denumire = denumire; }

    public String getDescriere() { return descriere; }
    public void setDescriere(String descriere) { this.descriere = descriere; }

    public Integer getNumarSezlonguri() { return numarSezlonguri; }
    public void setNumarSezlonguri(Integer numarSezlonguri) { this.numarSezlonguri = numarSezlonguri; }

    // ✅ ADD MISSING GETTERS/SETTERS FOR COORDINATES
    public BigDecimal getLatitudine() { return latitudine; }
    public void setLatitudine(BigDecimal latitudine) { this.latitudine = latitudine; }

    public BigDecimal getLongitudine() { return longitudine; }
    public void setLongitudine(BigDecimal longitudine) { this.longitudine = longitudine; }

    public Boolean getActiv() { return activ; }
    public void setActiv(Boolean activ) { this.activ = activ; }
}