package com.example.fullstacktemplate.dto;

import lombok.Data;
import javax.validation.constraints.*;

/**
 * DTO pentru înregistrarea managerilor cu datele firmei incluse
 */
@Data
public class SignUpManagerRequestDto {
    
    // ========== DATE PERSONALE ==========
    @NotBlank(message = "Numele este obligatoriu")
    @Size(min = 2, max = 50, message = "Numele trebuie să aibă între 2 și 50 de caractere")
    private String name;
    
    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Email-ul nu este valid")
    private String email;
    
    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 6, message = "Parola trebuie să aibă cel puțin 6 caractere")
    private String password;
    
    @NotBlank(message = "Numărul de telefon este obligatoriu")
    @Pattern(regexp = "^[0-9+\\-\\s()]{8,15}$", 
             message = "Numărul de telefon trebuie să conțină între 8 și 15 caractere (cifre, +, -, spații, paranteză)")
    private String numarTelefon;
    
    // ========== DATE FIRMĂ ==========
    @NotNull(message = "Localitatea este obligatorie")
    private Integer localitateId;
    
    @NotBlank(message = "CUI-ul este obligatoriu")
    @Size(min = 2, max = 10, message = "CUI-ul trebuie să aibă între 2 și 10 caractere")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "CUI-ul poate conține doar litere mari și cifre")
    private String cui;
    
    @NotBlank(message = "Denumirea firmei este obligatorie")
    @Size(min = 3, max = 250, message = "Denumirea trebuie să aibă între 3 și 250 de caractere")
    private String denumire;
    
    @NotBlank(message = "Adresa este obligatorie")
    @Size(min = 5, max = 200, message = "Adresa trebuie să aibă între 5 și 200 de caractere")
    private String adresa;
    
    @NotBlank(message = "Telefonul firmei este obligatoriu")
    @Pattern(regexp = "^[0-9]{10}$", message = "Telefonul trebuie să conțină exact 10 cifre")
    private String telefonFirma;
    
    @NotBlank(message = "Email-ul firmei este obligatoriu")
    @Email(message = "Email-ul firmei nu este valid")
    @Size(max = 150, message = "Email-ul nu poate depăși 150 de caractere")
    private String emailFirma;
    
    // Constructors
    public SignUpManagerRequestDto() {}
    
    public SignUpManagerRequestDto(String name, String email, String password, String numarTelefon,
                                   Integer localitateId, String cui, String denumire, String adresa,
                                   String telefonFirma, String emailFirma) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.numarTelefon = numarTelefon;
        this.localitateId = localitateId;
        this.cui = cui;
        this.denumire = denumire;
        this.adresa = adresa;
        this.telefonFirma = telefonFirma;
        this.emailFirma = emailFirma;
    }
    
    @Override
    public String toString() {
        return "SignUpManagerRequestDto{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", numarTelefon='" + numarTelefon + '\'' +
                ", localitateId=" + localitateId +
                ", cui='" + cui + '\'' +
                ", denumire='" + denumire + '\'' +
                ", adresa='" + adresa + '\'' +
                ", telefonFirma='" + telefonFirma + '\'' +
                ", emailFirma='" + emailFirma + '\'' +
                '}';
    }
}