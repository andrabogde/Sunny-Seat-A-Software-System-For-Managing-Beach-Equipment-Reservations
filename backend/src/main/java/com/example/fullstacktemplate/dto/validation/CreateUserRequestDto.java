package com.example.fullstacktemplate.dto.validation;
import com.example.fullstacktemplate.model.Role;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CreateUserRequestDto {
    
    @NotBlank(message = "Numele este obligatoriu")
    @Size(min = 2, max = 100, message = "Numele trebuie să aibă între 2 și 100 de caractere")
    private String name;
    
    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Format email invalid")
    private String email;
    
    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 6, message = "Parola trebuie să aibă cel puțin 6 caractere")
    private String password;
    
    private Role role = Role.USER;
    private Boolean emailVerified = false;
    private Boolean twoFactorEnabled = false;
}