package com.example.fullstacktemplate.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "rezervari")
public class Rezervare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilizator_id", nullable = false)
    private User utilizator;

    @Column(name = "stare_rezervare", nullable = false, length = 250)
    private String stareRezervare;

    @Column(name = "cod_rezervare", nullable = false, length = 30)
    private String codRezervare;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

   

    @Column(name = "data_rezervare")
    private LocalDate dataRezervare;


    @Column(name = "suma_platita")
    private Double sumaPlatita;

    @Column(name = "stripe_payment_intent_id", length = 100)
    private String stripePaymentIntentId;

    // 🆕 RELAȚIA CU LINIILE REZERVĂRII
    @OneToMany(mappedBy = "rezervare", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RezervareLinie> linii = new ArrayList<>();

    @Transient
    private Integer userId;


    // Constructors
    public Rezervare() {}

    public Rezervare(User utilizator, String stareRezervare, String codRezervare) {
        this.utilizator = utilizator;
        this.stareRezervare = stareRezervare;
        this.codRezervare = codRezervare;
        this.createdAt = LocalDateTime.now();
        this.linii = new ArrayList<>();
    }

    // Getters and Setters existenți
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUtilizator() {
        return utilizator;
    }

    public void setUtilizator(User utilizator) {
        this.utilizator = utilizator;
    }

    public String getStareRezervare() {
        return stareRezervare;
    }

    public void setStareRezervare(String stareRezervare) {
        this.stareRezervare = stareRezervare;
    }

    public String getCodRezervare() {
        return codRezervare;
    }

    public void setCodRezervare(String codRezervare) {
        this.codRezervare = codRezervare;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

 

    public LocalDate getDataRezervare() {
        return dataRezervare;
    }

    public void setDataRezervare(LocalDate dataRezervare) {
        this.dataRezervare = dataRezervare;
    }


    public Double getSumaPlatita() {
        return sumaPlatita;
    }

    public void setSumaPlatita(Double sumaPlatita) {
        this.sumaPlatita = sumaPlatita;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    // 🆕 GETTERS ȘI SETTERS PENTRU LINII
    public List<RezervareLinie> getLinii() {
        return linii;
    }

    public void setLinii(List<RezervareLinie> linii) {
        this.linii = linii;
        // Asigură-te că bidirectional relationship este setat
        if (linii != null) {
            for (RezervareLinie linie : linii) {
                linie.setRezervare(this);
            }
        }
    }

    // 🆕 METODE HELPER PENTRU LINII
    public void addLinie(RezervareLinie linie) {
        if (this.linii == null) {
            this.linii = new ArrayList<>();
        }
        this.linii.add(linie);
        linie.setRezervare(this);
    }

    public void removeLinie(RezervareLinie linie) {
        if (this.linii != null) {
            this.linii.remove(linie);
            linie.setRezervare(null);
        }
    }

    // 🆕 METODE HELPER PENTRU CALCULE BAZATE PE LINII
    public int getTotalCantitateEchipamente() {
        if (linii == null || linii.isEmpty()) {
            return 0;
        }
        return linii.stream().mapToInt(RezervareLinie::getCantitate).sum();
    }

    public Double getTotalCalculatDinLinii() {
        if (linii == null || linii.isEmpty()) {
            return 0.0;
        }
        return linii.stream()
                .mapToDouble(linie -> linie.getPretCalculat() != null ? linie.getPretCalculat().doubleValue() : 0.0)
                .sum();
    }

    public List<String> getTipuriEchipamentRezervate() {
        if (linii == null || linii.isEmpty()) {
            return new ArrayList<>();
        }
        return linii.stream()
                .map(RezervareLinie::getTipEchipamentNume)
                .distinct()
                .toList();
    }

    // Metode helper pentru stări comune (existente)
    public boolean isConfirmata() {
        return "CONFIRMATA".equalsIgnoreCase(this.stareRezervare);
    }

    public boolean isAnulata() {
        return "ANULATA".equalsIgnoreCase(this.stareRezervare);
    }

    public boolean isPending() {
        return "PENDING".equalsIgnoreCase(this.stareRezervare);
    }

    public boolean isFinalizata() {
        return "FINALIZATA".equalsIgnoreCase(this.stareRezervare);
    }

    // Metode pentru setarea stărilor (existente)
    public void confirma() {
        this.stareRezervare = "CONFIRMATA";
    }

    public void anuleaza() {
        this.stareRezervare = "ANULATA";
    }

    public void setPending() {
        this.stareRezervare = "PENDING";
    }

    public void finalizeaza() {
        this.stareRezervare = "FINALIZATA";
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Rezervare{" +
                "id=" + id +
                ", codRezervare='" + codRezervare + '\'' +
                ", stareRezervare='" + stareRezervare + '\'' +
                
                ", dataRezervare=" + dataRezervare +
            
                ", sumaPlatita=" + sumaPlatita +
                ", numarLinii=" + (linii != null ? linii.size() : 0) +
                ", createdAt=" + createdAt +
                '}';
    }

   
}