package com.example.fullstacktemplate.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.Pattern;

/**
 * DTO pentru schimbarea parolei utilizatorului
 */
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"currentPassword", "newPassword"}) // Excludem parolele din toString pentru securitate
public class ChangePasswordDto {

    @NotBlank(message = "Parola curentă este obligatorie")
    private String currentPassword;

    @NotBlank(message = "Parola nouă este obligatorie")
    @Size(min = 6, max = 50, message = "Parola nouă trebuie să aibă între 6 și 50 de caractere")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Parola nouă trebuie să conțină cel puțin o literă mică, o literă mare și o cifră"
    )
    private String newPassword;

    /**
     * Constructor pentru schimbarea obișnuită a parolei
     */
    public ChangePasswordDto(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    /**
     * Verifică dacă DTO-ul este valid pentru o schimbare de parolă de bază
     */
    public boolean isValidBasicChange() {
        return currentPassword != null && !currentPassword.trim().isEmpty() &&
               newPassword != null && !newPassword.trim().isEmpty() &&
               newPassword.length() >= 6;
    }

    /**
     * Verifică dacă parola nouă respectă criteriile de complexitate
     */
    public boolean hasStrongPassword() {
        if (newPassword == null || newPassword.length() < 6) {
            return false;
        }
        
        boolean hasLower = newPassword.chars().anyMatch(Character::isLowerCase);
        boolean hasUpper = newPassword.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = newPassword.chars().anyMatch(Character::isDigit);
        
        return hasLower && hasUpper && hasDigit;
    }
}