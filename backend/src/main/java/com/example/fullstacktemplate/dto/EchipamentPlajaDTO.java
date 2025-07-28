package com.example.fullstacktemplate.dto;

public class EchipamentPlajaDTO {
    private Integer id;
    private String denumire;
    private Integer plajaId;
    private String plajaDenumire;
    private Integer tipEchipamentId;
    private String tipEchipamentDenumire;
    private Integer stareEchipamentId;
    private String stareEchipamentDenumire;
    private Integer pozitieLinie;
    private Integer pozitieColoana;
    private Integer pretCurent;
    private Boolean activ;
    private Integer userId;

    // Constructor
    public EchipamentPlajaDTO(Integer id, String denumire, Integer plajaId, String plajaDenumire, 
                             Integer tipEchipamentId, String tipEchipamentDenumire, 
                             Integer stareEchipamentId, String stareEchipamentDenumire,
                             Integer pozitieLinie, Integer pozitieColoana, Integer pretCurent, Boolean activ, Integer userId) {
        this.id = id;
        this.denumire = denumire;
        this.plajaId = plajaId;
        this.plajaDenumire = plajaDenumire;
        this.tipEchipamentId = tipEchipamentId;
        this.tipEchipamentDenumire = tipEchipamentDenumire;
        this.stareEchipamentId = stareEchipamentId;
        this.stareEchipamentDenumire = stareEchipamentDenumire;
        this.pozitieLinie = pozitieLinie;
        this.pozitieColoana = pozitieColoana;
        this.pretCurent = pretCurent;
        this.activ = activ;
        this.userId=userId;
    }

    // Getters
    public Integer getId() { return id; }
    public String getDenumire() { return denumire; }
    public Integer getPlajaId() { return plajaId; }
    public String getPlajaDenumire() { return plajaDenumire; }
    public Integer getTipEchipamentId() { return tipEchipamentId; }
    public String getTipEchipamentDenumire() { return tipEchipamentDenumire; }
    public Integer getStareEchipamentId() { return stareEchipamentId; }
    public String getStareEchipamentDenumire() { return stareEchipamentDenumire; }
    public Integer getPozitieLinie() { return pozitieLinie; }
    public Integer getPozitieColoana() { return pozitieColoana; }
    public Integer getPretCurent() { return pretCurent; }
    public Boolean getActiv() { return activ; }

    // Setters (doar cei pe care îi ai)
    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}