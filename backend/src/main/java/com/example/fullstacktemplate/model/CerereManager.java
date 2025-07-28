package com.example.fullstacktemplate.model;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import com.example.fullstacktemplate.converters.StatusCerereConverter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cereri_manageri")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CerereManager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
@JsonIgnoreProperties({"jwtTokens", "twoFactorRecoveryCodes", "cereriManager"}) // ✅ ADAUGĂ ASTA
private User user;

    @Column(name = "localitate_id", nullable = false)
    private Integer localitate;

    @Column(length = 10, nullable = false, unique = true)
    private String cui;

    @Column(nullable = false)
    private String denumire;

    @Column(nullable = false)
    private String adresa;

    @Column(length = 10, nullable = false, unique = true)
    private String telefon;

    @Column(length = 150, nullable = false, unique = true)
    private String email;

    @Convert(converter = StatusCerereConverter.class)  // ✅ SCHIMBAT DE LA @Enumerated
    @Column(nullable = false)
    @Builder.Default
    private StatusCerere status = StatusCerere.IN_ASTEPTARE;

    @Column(name = "data_cerere", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "motiv_respingere")
    private String motivRespingere;

    // ✅ Metodă helper pentru verificare status
    public boolean isInAsteptare() {
        return this.status == StatusCerere.IN_ASTEPTARE;
    }

    public boolean isAprobat() {
        return this.status == StatusCerere.APROBAT;
    }

    public boolean isRespins() {
        return this.status == StatusCerere.RESPINS;
    }
}