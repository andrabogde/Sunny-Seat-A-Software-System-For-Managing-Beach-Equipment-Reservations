package com.example.fullstacktemplate.model;


import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "poze")
public class Poza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "plaja_id", nullable = false)
    private Integer plajaId;

    @Column(name = "cale_imagine", nullable = false, length = 250)
    private String caleImagine;

    @Column(nullable = false)
    private Integer ordine;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPlajaId() {
        return plajaId;
    }

    public void setPlajaId(Integer plajaId) {
        this.plajaId = plajaId;
    }

    public String getCaleImagine() {
        return caleImagine;
    }

    public void setCaleImagine(String caleImagine) {
        this.caleImagine = caleImagine;
    }

    public Integer getOrdine() {
        return ordine;
    }

    public void setOrdine(Integer ordine) {
        this.ordine = ordine;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
