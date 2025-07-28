package com.example.fullstacktemplate.model;

import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "favorite", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "plaja_id"}))
public class Favorite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "plaja_id", nullable = false)
    private Integer plajaId;
    
    @Column(name = "data_ora_adaugare", nullable = false)
    private LocalDateTime dataOraAdaugare;
    
    // Relații cu alte entități cu lazy loading și proper mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plaja_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Plaja plaja;
    
    // Constructori
    public Favorite() {
        this.dataOraAdaugare = LocalDateTime.now();
    }
    
    public Favorite(Long userId, Integer plajaId) {
        this.userId = userId;
        this.plajaId = plajaId;
        this.dataOraAdaugare = LocalDateTime.now();
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
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Plaja getPlaja() {
        return plaja;
    }
    
    public void setPlaja(Plaja plaja) {
        this.plaja = plaja;
    }
    
    @Override
    public String toString() {
        return "Favorite{" +
                "id=" + id +
                ", userId=" + userId +
                ", plajaId=" + plajaId +
                ", dataOraAdaugare=" + dataOraAdaugare +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Favorite favorite = (Favorite) o;
        
        if (!userId.equals(favorite.userId)) return false;
        return plajaId.equals(favorite.plajaId);
    }
    
    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + plajaId.hashCode();
        return result;
    }
}