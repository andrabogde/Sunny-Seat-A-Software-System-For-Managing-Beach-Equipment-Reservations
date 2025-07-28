package com.example.fullstacktemplate.dto;


public class FirmaDTO {
    private String cui;
    private String denumire;
    private String adresa;
    private String telefon;
    private String email;
    private Boolean activ;

    // Getters și Setters
    public String getCui() { return cui; }
    public void setCui(String cui) { this.cui = cui; }

    public String getDenumire() { return denumire; }
    public void setDenumire(String denumire) { this.denumire = denumire; }

    public String getAdresa() { return adresa; }
    public void setAdresa(String adresa) { this.adresa = adresa; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getActiv() { return activ; }
    public void setActiv(Boolean activ) { this.activ = activ; }
}

