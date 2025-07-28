package com.example.fullstacktemplate.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class CerereManagerDto {
    
    @NotNull(message = "ID-ul utilizatorului este obligatoriu")
    private Long userId;
    
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
    
    @NotBlank(message = "Telefonul este obligatoriu")
    @Pattern(regexp = "^[0-9]{10}$", message = "Telefonul trebuie să conțină exact 10 cifre")
    private String telefon;
    
    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Email-ul nu este valid")
    @Size(max = 150, message = "Email-ul nu poate depăși 150 de caractere")
    private String email;
}