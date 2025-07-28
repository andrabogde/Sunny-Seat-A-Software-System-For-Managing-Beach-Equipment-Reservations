package com.example.fullstacktemplate.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.example.fullstacktemplate.validators.UniqueDenumire;

@Entity
@Table(
    name = "tipuri_echipamente_plaja"
   // uniqueConstraints = @UniqueConstraint(columnNames = "denumire")
)
public class TipEchipamentPlaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Denumirea este obligatorie.")
   // @UniqueDenumire // Validăm unicitatea
    @Column(nullable = false, length = 150, unique = true)
    private String denumire;

    @Column(name = "data_ora", nullable = false)
    private LocalDateTime dataOra;

    // Getters and Setters
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

    public LocalDateTime getDataOra() {
        return dataOra;
    }

    public void setDataOra(LocalDateTime dataOra) {
        this.dataOra = dataOra;
    }
}

