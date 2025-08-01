package com.example.fullstacktemplate.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponseDto {
    private String accessToken;
    private Boolean twoFactorRequired;
    private String tokenType = "Bearer";
    private String message;
    
    // ADĂUGAT - ESENȚIAL pentru frontend
    private UserDto user;
}