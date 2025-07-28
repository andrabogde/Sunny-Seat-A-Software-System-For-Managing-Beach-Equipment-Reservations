package com.example.fullstacktemplate.dto;

import javax.validation.constraints.*;

public class SignUpRequestDto {
    
    @NotBlank(message = "Numele este obligatoriu")
    @Size(min = 2, max = 50, message = "Numele trebuie să aibă între 2 și 50 de caractere")
    private String name;
    
    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Email-ul nu este valid")
    private String email;
    
    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 6, message = "Parola trebuie să aibă cel puțin 6 caractere")
    private String password;
    
    // ✅ OBLIGATORIU ȘI CU VALIDARE DE FORMAT
    @NotBlank(message = "Numărul de telefon este obligatoriu")
    @Pattern(regexp = "^[0-9+\\-\\s()]{8,15}$", 
             message = "Numărul de telefon trebuie să conțină între 8 și 15 caractere (cifre, +, -, spații, paranteză)")
    private String numarTelefon;

    private String role="USER";
    
    // Constructors
    public SignUpRequestDto() {}
    
    public SignUpRequestDto(String name, String email, String password, String numarTelefon, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.numarTelefon = numarTelefon;
        this.role=role;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getNumarTelefon() {
        return numarTelefon;
    }
    
    public void setNumarTelefon(String numarTelefon) {
        this.numarTelefon = numarTelefon;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    
    @Override
    public String toString() {
        return "SignUpRequestDto{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", numarTelefon='" + numarTelefon + '\'' +
                '}';
    }
}