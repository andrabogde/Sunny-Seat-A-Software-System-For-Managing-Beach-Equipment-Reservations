package com.example.fullstacktemplate.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;



@Entity
@Table(name = "firme_utilizatori")
public class FirmaUtilizator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firma_id", nullable = false)
    private Firma firma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilizatori_id", nullable = false)
    private User utilizator;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Firma getFirma() {
        return firma;
    }

    public void setFirma(Firma firma) {
        this.firma = firma;
    }

    public User getUtilizator() {
        return utilizator;
    }

    public void setUtilizator(User utilizator) {
        this.utilizator = utilizator;
    }
}

