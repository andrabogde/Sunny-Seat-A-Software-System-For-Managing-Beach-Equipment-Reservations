package com.example.fullstacktemplate.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "echipamente_plaja")
public class EchipamentPlaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Denumirea este obligatorie.")
    @Column(nullable = false, length = 150)
    private String denumire;

    // 🆕 RELAȚIA CU PLAJA
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plaja_id", nullable = false)
    private Plaja plaja;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tip_echipament_id", nullable = false)
    private TipEchipamentPlaja tipEchipament;

    // 🆕 RELAȚIA CU STAREA ECHIPAMENTULUI
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stare_echipament_id")
    private StareEchipamentPlaja stareEchipament;

    @Column(name = "disponibil")
    private Boolean disponibil = true;

    // 🆕 POZIȚII PENTRU GRID
    @Column(name = "pozitie_linie")
    private Integer pozitieLinie;

    @Column(name = "pozitie_coloana")
    private Integer pozitieColoana;

    // 🆕 STATUS ACTIV
    @Column(name = "activ")
    private Boolean activ = true;

    // @OneToMany(mappedBy = "echipamentPlaja", cascade = CascadeType.ALL, fetch =
    // FetchType.LAZY)
    // private List<Pret> preturi;

    // 🆕 RELAȚIA CU PREȚUL CURENT (transient pentru că se calculează dinamic)
    @Transient
    private Pret pretCurent;

    @Transient
    private Integer userId;

    // Constructors
    public EchipamentPlaja() {
    }

    public EchipamentPlaja(String denumire, Plaja plaja, TipEchipamentPlaja tipEchipament) {
        this.denumire = denumire;
        this.plaja = plaja;
        this.tipEchipament = tipEchipament;

        this.activ = true;

    }

    // Getters and Setters EXISTENTE
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

    public TipEchipamentPlaja getTipEchipament() {
        return tipEchipament;
    }

    public void setTipEchipament(TipEchipamentPlaja tipEchipament) {
        this.tipEchipament = tipEchipament;
    }

    public Boolean getDisponibil() {
        return disponibil;
    }

    public void setDisponibil(Boolean disponibil) {
        this.disponibil = disponibil;
    }

    // 🆕 GETTERS ȘI SETTERS NOI
    public Plaja getPlaja() {
        return plaja;
    }

    public void setPlaja(Plaja plaja) {
        this.plaja = plaja;
    }

    public StareEchipamentPlaja getStareEchipament() {
        return stareEchipament;
    }

    public void setStareEchipament(StareEchipamentPlaja stareEchipament) {
        this.stareEchipament = stareEchipament;
    }

    public Integer getPozitieLinie() {
        return pozitieLinie;
    }

    public void setPozitieLinie(Integer pozitieLinie) {
        this.pozitieLinie = pozitieLinie;
    }

    public Integer getPozitieColoana() {
        return pozitieColoana;
    }

    public void setPozitieColoana(Integer pozitieColoana) {
        this.pozitieColoana = pozitieColoana;
    }

    public Boolean getActiv() {
        return activ;
    }

    public void setActiv(Boolean activ) {
        this.activ = activ;
    }

    public Pret getPretCurent() {
        return pretCurent;
    }

    public void setPretCurent(Pret pretCurent) {
        this.pretCurent = pretCurent;
    }

    @Override
    public String toString() {
        return "EchipamentPlaja{" +
                "id=" + id +
                ", denumire='" + denumire + '\'' +
                ", plaja=" + (plaja != null ? plaja.getDenumire() : "null") +
                ", tipEchipament=" + (tipEchipament != null ? tipEchipament.getDenumire() : "null") +

                ", activ=" + activ +

                ", pozitieLinie=" + pozitieLinie +
                ", pozitieColoana=" + pozitieColoana +
                '}';
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}