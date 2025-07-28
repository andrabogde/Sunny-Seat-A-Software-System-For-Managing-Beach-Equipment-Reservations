package com.example.fullstacktemplate.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "rezervari_linii")
public class RezervareLinie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rezervare_id", nullable = false)
    private Rezervare rezervare;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tip_echipament_id", nullable = false)
    private TipEchipamentPlaja tipEchipament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "echipament_id", nullable = false)
    private EchipamentPlaja echipament;

    @Column(name = "cantitate", nullable = false)
    private Integer cantitate;

    @Column(name = "data_inceput", nullable = false)
    private LocalDate dataInceput;

    @Column(name = "data_sfarsit", nullable = false)
    private LocalDate dataSfarsit;

    @Column(name = "pret_bucata", nullable = false)
    private Integer pretBucata;

    @Column(name = "pret_calculat", nullable = false)
    private Integer pretCalculat;

    // Constructors
    public RezervareLinie() {}

    public RezervareLinie(Rezervare rezervare, TipEchipamentPlaja tipEchipament, 
                         EchipamentPlaja echipament, Integer cantitate, 
                         LocalDate dataInceput, LocalDate dataSfarsit, 
                         Integer pretBucata, Integer pretCalculat) {
        this.rezervare = rezervare;
        this.tipEchipament = tipEchipament;
        this.echipament = echipament;
        this.cantitate = cantitate;
        this.dataInceput = dataInceput;
        this.dataSfarsit = dataSfarsit;
        this.pretBucata = pretBucata;
        this.pretCalculat = pretCalculat;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Rezervare getRezervare() {
        return rezervare;
    }

    public void setRezervare(Rezervare rezervare) {
        this.rezervare = rezervare;
    }

    public TipEchipamentPlaja getTipEchipament() {
        return tipEchipament;
    }

    public void setTipEchipament(TipEchipamentPlaja tipEchipament) {  // ✅ CORECT
        this.tipEchipament = tipEchipament;
    }

    public EchipamentPlaja getEchipament() {
        return echipament;
    }

    public void setEchipament(EchipamentPlaja echipament) {
        this.echipament = echipament;
    }

    public Integer getCantitate() {
        return cantitate;
    }

    public void setCantitate(Integer cantitate) {
        this.cantitate = cantitate;
    }

    public LocalDate getDataInceput() {
        return dataInceput;
    }

    public void setDataInceput(LocalDate dataInceput) {
        this.dataInceput = dataInceput;
    }

    public LocalDate getDataSfarsit() {
        return dataSfarsit;
    }

    public void setDataSfarsit(LocalDate dataSfarsit) {
        this.dataSfarsit = dataSfarsit;
    }

    public Integer getPretBucata() {
        return pretBucata;
    }

    public void setPretBucata(Integer pretBucata) {
        this.pretBucata = pretBucata;
    }

    public Integer getPretCalculat() {
        return pretCalculat;
    }

    public void setPretCalculat(Integer pretCalculat) {
        this.pretCalculat = pretCalculat;
    }

    // Helper methods
    public String getTipEchipamentNume() {
        return tipEchipament != null ? tipEchipament.getDenumire() : "Tip necunoscut";
    }

    public String getEchipamentNume() {
        return echipament != null ? echipament.getDenumire() : "Echipament necunoscut";
    }

    @Override
    public String toString() {
        return "RezervareLinie{" +
                "id=" + id +
                ", cantitate=" + cantitate +
                ", dataInceput=" + dataInceput +
                ", dataSfarsit=" + dataSfarsit +
                ", pretBucata=" + pretBucata +
                ", pretCalculat=" + pretCalculat +
                ", tipEchipament=" + getTipEchipamentNume() +
                '}';
    }
}