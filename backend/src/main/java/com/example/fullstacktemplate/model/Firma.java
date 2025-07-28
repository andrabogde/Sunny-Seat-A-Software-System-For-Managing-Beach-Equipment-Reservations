package com.example.fullstacktemplate.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "firme", uniqueConstraints = {
        @UniqueConstraint(columnNames = "cui", name = "cui"),
        @UniqueConstraint(columnNames = "telefon", name = "telefon"),
        @UniqueConstraint(columnNames = "email", name = "email")
})
public class Firma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 10)
    private String cui;

    @Column(nullable = false, length = 250)
    private String denumire;

    @Column(nullable = false, length = 200)
    private String adresa;

    @Column(nullable = false, length = 10)
    private String telefon;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private Boolean activ;

    @Column(name = "localitate", nullable = false)
    private Integer localitate;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCui() {
        return cui;
    }

    public void setCui(String cui) {
        this.cui = cui;
    }

    public String getDenumire() {
        return denumire;
    }

    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActiv() {
        return activ;
    }

    public void setActiv(Boolean activ) {
        this.activ = activ;
    }

    public Integer getLocalitate() {
        return localitate;
    }

    public void setLocalitate(Integer localitate) {
        this.localitate = localitate;
    }

    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return "Denumire firma "+denumire;
    }
}
