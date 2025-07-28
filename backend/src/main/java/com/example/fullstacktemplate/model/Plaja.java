package com.example.fullstacktemplate.model;

import java.math.BigDecimal;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.example.fullstacktemplate.converters.JpaJsonConverter;

@Entity
@Table(name = "plaje")
public class Plaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firma_id", nullable = false)
    private Firma firma;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "statiuni_id", nullable = false)
    private Statiune statiune;

    @Column(name = "denumire", nullable = false, length = 150)
    private String denumire;

    @Column(name = "descriere", nullable = false, length = 250)
    private String descriere;

    @Column(name = "adresa", length = 200)
    private String adresa;

    @Column(name = "numar_sezlonguri", nullable = false)
    private Integer numarSezlonguri;

    // ✅ ADD MISSING COORDINATE FIELDS
    @Column(name = "latitudine", nullable = false, precision = 9, scale = 6)
    private BigDecimal latitudine;

    @Column(name = "longitudine", nullable = false, precision = 9, scale = 6)
    private BigDecimal longitudine;

    @Column(nullable = false)
    private Boolean activ;
    
    // Coloană pentru stocarea JSON-ului în baza de date
    @Column(name = "detalii_web", columnDefinition = "JSON")
    @Convert(converter = JpaJsonConverter.class) // Convertor pentru JSON <-> Map
    private Map<String, Object> detaliiWeb;

    @Transient
    private Integer userId;

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

    public Statiune getStatiune() {
        return statiune;
    }

    public void setStatiune(Statiune statiune) {
        this.statiune = statiune;
    }

    public String getDenumire() {
        return denumire;
    }

    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }

    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public Integer getNumarSezlonguri() {
        return numarSezlonguri;
    }

    public void setNumarSezlonguri(Integer numarSezlonguri) {
        this.numarSezlonguri = numarSezlonguri;
    }

    // ✅ ADD MISSING GETTERS/SETTERS FOR COORDINATES
    public BigDecimal getLatitudine() {
        return latitudine;
    }

    public void setLatitudine(BigDecimal latitudine) {
        this.latitudine = latitudine;
    }

    public BigDecimal getLongitudine() {
        return longitudine;
    }

    public void setLongitudine(BigDecimal longitudine) {
        this.longitudine = longitudine;
    }

    public Boolean getActiv() {
        return activ;
    }

    public void setActiv(Boolean activ) {
        this.activ = activ;
    }

    public Map<String, Object> getDetaliiWeb() {
        return detaliiWeb;
    }

    public void setDetaliiWeb(Map<String, Object> detaliiWeb) {
        this.detaliiWeb = detaliiWeb;
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}