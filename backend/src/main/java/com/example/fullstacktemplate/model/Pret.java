package com.example.fullstacktemplate.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "preturi")
public class Pret {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "echipament_plaja_id", nullable = false)
    private Integer echipamentPlajaId;

    @Column(nullable = false)
    private Integer valoare;

    @Column(name = "data_ora", nullable = false)
    private LocalDateTime dataOra;

    // Getters și Setters
    public Integer getId() { 
        return id; 
    }
    
    public void setId(Integer id) { 
        this.id = id; 
    }

    public Integer getEchipamentPlajaId() { 
        return echipamentPlajaId; 
    }
    
    public void setEchipamentPlajaId(Integer echipamentPlajaId) { 
        this.echipamentPlajaId = echipamentPlajaId; 
    }

    public Integer getValoare() { 
        return valoare; 
    }
    
    public void setValoare(Integer valoare) { 
        this.valoare = valoare; 
    }

    public LocalDateTime getDataOra() { 
        return dataOra; 
    }
    
    public void setDataOra(LocalDateTime dataOra) { 
        this.dataOra = dataOra; 
    }
}