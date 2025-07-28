package com.example.fullstacktemplate.dto;

import com.example.fullstacktemplate.dto.validation.File;
import com.example.fullstacktemplate.model.AuthProvider;
import com.example.fullstacktemplate.model.FileType;
import com.example.fullstacktemplate.model.Role;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
public class UserDto {

    // ID și role - esențiale pentru frontend
    private Long id;
    private Role role;
    private AuthProvider authProvider;
    private Boolean emailVerified;

    // Câmpurile existente
    @Size(min = 4, message = "name.lengthRestriction")
    private String name;
    
    @Email(message = "email.invalidFormat")
    private String email;

    // ✅ ADĂUGAT: Numărul de telefon cu validare
    @Pattern(regexp = "^(\\+4|0)?[0-9]{9,10}$", message = "Numărul de telefon trebuie să fie valid (ex: 0721234567)")
    private String numarTelefon;

    @File(maxSizeBytes = 10000000, fileTypes = {FileType.IMAGE_JPEG, FileType.IMAGE_PNG}, message = "profileImage.invalidMessage")
    private FileDbDto profileImage;

    private Boolean twoFactorEnabled;

    private O2AuthInfoDto o2AuthInfo;
}