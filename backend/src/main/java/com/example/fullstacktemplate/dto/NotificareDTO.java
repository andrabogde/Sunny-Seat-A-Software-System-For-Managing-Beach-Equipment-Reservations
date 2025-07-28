package com.example.fullstacktemplate.dto;

import java.time.LocalDateTime;

public class NotificareDTO {
    private Long id;
    private String continut;
    private LocalDateTime dataOra;
    private Long rezervareId;
    
    // Constructors
    public NotificareDTO() {}
    
    public NotificareDTO(Long id, String continut, LocalDateTime dataOra, Long rezervareId) {
        this.id = id;
        this.continut = continut;
        this.dataOra = dataOra;
        this.rezervareId = rezervareId;
    }
    
    // Getters și Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContinut() { return continut; }
    public void setContinut(String continut) { this.continut = continut; }
    
    public LocalDateTime getDataOra() { return dataOra; }
    public void setDataOra(LocalDateTime dataOra) { this.dataOra = dataOra; }
    
    public Long getRezervareId() { return rezervareId; }
    public void setRezervareId(Long rezervareId) { this.rezervareId = rezervareId; }
}
