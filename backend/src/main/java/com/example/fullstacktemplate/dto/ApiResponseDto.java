package com.example.fullstacktemplate.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponseDto {
    private boolean success;
    private String message;
    private String field; // Pentru erori specifice unui câmp (ex: "currentPassword")
    private Object data; // Pentru date suplimentare

    // Constructor original - pentru compatibilitate
    public ApiResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Constructor pentru erori de câmp
    public ApiResponseDto(boolean success, String message, String field) {
        this.success = success;
        this.message = message;
        this.field = field;
    }

    // Constructor cu date
    public ApiResponseDto(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Factory methods pentru ușurința utilizării
    public static ApiResponseDto success(String message) {
        return new ApiResponseDto(true, message);
    }

    public static ApiResponseDto success(String message, Object data) {
        return new ApiResponseDto(true, message, data);
    }

    public static ApiResponseDto error(String message) {
        return new ApiResponseDto(false, message);
    }

    public static ApiResponseDto fieldError(String field, String message) {
        return new ApiResponseDto(false, message, field);
    }
}