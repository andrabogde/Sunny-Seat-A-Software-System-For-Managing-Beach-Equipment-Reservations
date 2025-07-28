package com.example.fullstacktemplate.dto;



import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class FavoriteDto {
    
    private Integer id;
    private Long userId;
    private Integer plajaId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataOraAdaugare;
    
    // Date despre plajă (pentru afișare în frontend)
    private String numePlaja;
    private String numeStatiune;
    private Double rating;
    private Integer numarSezlonguri;
    private String imagineUrl;
    
    // Constructori
    public FavoriteDto() {}
    
    public FavoriteDto(Integer id, Long userId, Integer plajaId, LocalDateTime dataOraAdaugare) {
        this.id = id;
        this.userId = userId;
        this.plajaId = plajaId;
        this.dataOraAdaugare = dataOraAdaugare;
    }
    
    // Getteri și Setteri
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Integer getPlajaId() {
        return plajaId;
    }
    
    public void setPlajaId(Integer plajaId) {
        this.plajaId = plajaId;
    }
    
    public LocalDateTime getDataOraAdaugare() {
        return dataOraAdaugare;
    }
    
    public void setDataOraAdaugare(LocalDateTime dataOraAdaugare) {
        this.dataOraAdaugare = dataOraAdaugare;
    }
    
    public String getNumePlaja() {
        return numePlaja;
    }
    
    public void setNumePlaja(String numePlaja) {
        this.numePlaja = numePlaja;
    }
    
    public String getNumeStatiune() {
        return numeStatiune;
    }
    
    public void setNumeStatiune(String numeStatiune) {
        this.numeStatiune = numeStatiune;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public Integer getNumarSezlonguri() {
        return numarSezlonguri;
    }
    
    public void setNumarSezlonguri(Integer numarSezlonguri) {
        this.numarSezlonguri = numarSezlonguri;
    }
    
    public String getImagineUrl() {
        return imagineUrl;
    }
    
    public void setImagineUrl(String imagineUrl) {
        this.imagineUrl = imagineUrl;
    }
}

