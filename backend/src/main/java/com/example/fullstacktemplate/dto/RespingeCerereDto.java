package com.example.fullstacktemplate.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespingeCerereDto {
    
    @Size(max = 500, message = "Motivul nu poate depăși 500 de caractere")
    private String motiv;
}