package com.example.fullstacktemplate.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificari")
public class Notificare {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "utilizator_id", nullable = false)
    private Long utilizatorId;
    
    @Column(name = "rezervare_id")
    private Long rezervareId;
    
    @Column(name = "data_ora", nullable = false)
    private LocalDateTime dataOra;
    
    @Column(name = "continut", nullable = false, length = 500)
    private String continut;
    
    // Constructors
    public Notificare() {}
    
    public Notificare(Long utilizatorId, String continut) {
        this.utilizatorId = utilizatorId;
        this.continut = continut;
        this.dataOra = LocalDateTime.now();
    }
    
    public Notificare(Long utilizatorId, Long rezervareId, String continut) {
        this.utilizatorId = utilizatorId;
        this.rezervareId = rezervareId;
        this.continut = continut;
        this.dataOra = LocalDateTime.now();
    }
    
    // Getters și Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUtilizatorId() { return utilizatorId; }
    public void setUtilizatorId(Long utilizatorId) { this.utilizatorId = utilizatorId; }
    
    public Long getRezervareId() { return rezervareId; }
    public void setRezervareId(Long rezervareId) { this.rezervareId = rezervareId; }
    
    public LocalDateTime getDataOra() { return dataOra; }
    public void setDataOra(LocalDateTime dataOra) { this.dataOra = dataOra; }
    
    public String getContinut() { return continut; }
    public void setContinut(String continut) { this.continut = continut; }
}