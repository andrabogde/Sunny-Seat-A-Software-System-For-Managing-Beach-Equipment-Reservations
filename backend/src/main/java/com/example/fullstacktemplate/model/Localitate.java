package com.example.fullstacktemplate.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "localitati")
public class Localitate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "tara_id", nullable = false)
    private Tara tara;

    @Column(nullable = false, length = 150)
    private String denumire;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipLocalitate tip;

    // Getteri și Setteri
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Tara getTara() {
        return tara;
    }

    public void setTara(Tara tara) {
        this.tara = tara;
    }

    public String getDenumire() {
        return denumire;
    }

    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }

    public TipLocalitate getTip() {
        return tip;
    }

    public void setTip(TipLocalitate tip) {
        this.tip = tip;
    }
}

