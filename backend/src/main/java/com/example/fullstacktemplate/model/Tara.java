package com.example.fullstacktemplate.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "tari")
public class Tara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100, unique = true)
    private String denumire;

    @Column(name = "cod_tara", nullable = false, length = 2, unique = true)
    private String codTara;

    public Tara() {
    }

    public Tara(String denumire, String codTara) {
        this.denumire = denumire;
        this.codTara = codTara;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDenumire() {
        return denumire;
    }

    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }

    public String getCodTara() {
        return codTara;
    }

    public void setCodTara(String codTara) {
        this.codTara = codTara;
    }
}

