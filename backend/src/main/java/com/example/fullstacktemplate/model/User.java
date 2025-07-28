package com.example.fullstacktemplate.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email", name = "email"),
        @UniqueConstraint(columnNames = "numar_telefon", name = "numar_telefon")
})
@Getter
@Setter
@ToString(exclude = {"password", "resetToken", "twoFactorSecret"}) // Excludem datele sensibile din toString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ ADĂUGAT: Numărul de telefon
    @Column(name = "numar_telefon", unique = true)
    private String numarTelefon;

    @Column
    private String requestedNewEmail;

    @OneToOne(targetEntity = FileDb.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_image_id")
    private FileDb profileImage;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @JsonIgnore // Nu includem parola în răspunsurile JSON
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String providerId;
    
    @JsonIgnore
    private String twoFactorSecret;

    @Column(nullable = false)
    private Boolean twoFactorEnabled;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TwoFactorRecoveryCode> twoFactorRecoveryCodes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<JwtToken> jwtTokens;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore  // ✅ IMPORTANT: Nu serializa în JSON
    private List<CerereManager> cereriManager;

    // ✅ CÂMPURI NOI PENTRU GESTIONAREA PAROLELOR
    
    @Column
    private LocalDateTime passwordChangedAt;

    @Column
    @JsonIgnore
    private String resetToken;

    @Column
    private LocalDateTime resetTokenExpiry;

    @Column
    private Integer failedLoginAttempts = 0;

    @Column
    private LocalDateTime lastLoginAt;

    @Column
    private LocalDateTime accountLockedUntil;

    @Column
    private Boolean forcePasswordChange = false;

    @Column
    private Integer tokenVersion = 1; // Pentru invalidarea token-urilor JWT

    @Column
    private String lastLoginIp;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    // ✅ LIFECYCLE CALLBACKS
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (passwordChangedAt == null) {
            passwordChangedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ✅ METODE UTILITARE

    /**
     * Returnează numele complet al utilizatorului (pentru compatibilitate cu frontend)
     */
    @JsonProperty("fullName")
    public String getFullName() {
        return name; // Sau poți să faci name să fie format din "firstName lastName"
    }

    /**
     * Verifică dacă contul este blocat
     */
    public boolean isAccountLocked() {
        return accountLockedUntil != null && 
               accountLockedUntil.isAfter(LocalDateTime.now());
    }

    /**
     * Verifică dacă utilizatorul trebuie să își schimbe parola
     */
    public boolean shouldChangePassword() {
        // Dacă este forțată schimbarea
        if (Boolean.TRUE.equals(forcePasswordChange)) {
            return true;
        }
        
        // Dacă parola nu a fost schimbată niciodată
        if (passwordChangedAt == null) {
            return true;
        }
        
        // Dacă au trecut mai mult de 90 de zile de la ultima schimbare
        return passwordChangedAt.isBefore(LocalDateTime.now().minusDays(90));
    }

    /**
     * Verifică dacă token-ul de reset este valid
     */
    public boolean isResetTokenValid(String token) {
        return resetToken != null && 
               resetToken.equals(token) && 
               resetTokenExpiry != null && 
               resetTokenExpiry.isAfter(LocalDateTime.now());
    }

    /**
     * Incrementează numărul de încercări de login eșuate
     */
    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts = (this.failedLoginAttempts == null ? 0 : this.failedLoginAttempts) + 1;
        
        // Blochează contul după 5 încercări eșuate
        if (this.failedLoginAttempts >= 5) {
            this.accountLockedUntil = LocalDateTime.now().plusMinutes(30);
        }
    }

    /**
     * Resetează încercările de login eșuate
     */
    public void resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
        this.accountLockedUntil = null;
    }

    /**
     * Marchează login-ul ca reușit
     */
    public void markSuccessfulLogin(String ipAddress) {
        this.lastLoginAt = LocalDateTime.now();
        this.lastLoginIp = ipAddress;
        resetFailedLoginAttempts();
    }

    /**
     * Setează token-ul de reset al parolei
     */
    public void setPasswordResetToken(String token, int expiryMinutes) {
        this.resetToken = token;
        this.resetTokenExpiry = LocalDateTime.now().plusMinutes(expiryMinutes);
    }

    /**
     * Curăță token-ul de reset al parolei
     */
    public void clearPasswordResetToken() {
        this.resetToken = null;
        this.resetTokenExpiry = null;
    }

    /**
     * Actualizează parola și marchează schimbarea
     */
    public void updatePassword(String newEncodedPassword) {
        this.password = newEncodedPassword;
        this.passwordChangedAt = LocalDateTime.now();
        this.forcePasswordChange = false;
        this.tokenVersion++; // Invalidează token-urile existente
        clearPasswordResetToken();
    }
}