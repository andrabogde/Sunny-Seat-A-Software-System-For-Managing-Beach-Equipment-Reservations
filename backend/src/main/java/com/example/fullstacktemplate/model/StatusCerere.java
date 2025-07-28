package com.example.fullstacktemplate.model;

/**
 * Enum pentru statusurile posibile ale unei cereri de manager
 */
public enum StatusCerere {
    IN_ASTEPTARE("in_asteptare", "În așteptare"),
    APROBAT("aprobat", "Aprobat"),
    RESPINS("respins", "Respins");

    private final String value;
    private final String displayName;

    StatusCerere(String value, String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    public String getValue() {
        return value;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convertește un string în enum StatusCerere
     * @param value valoarea string (ex: "in_asteptare")
     * @return StatusCerere corespunzător
     * @throws IllegalArgumentException dacă valoarea nu este validă
     */
    public static StatusCerere fromValue(String value) {
        for (StatusCerere status : StatusCerere.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status invalid: " + value);
    }

    /**
     * Verifică dacă statusul permite modificări
     * @return true dacă cererea poate fi modificată
     */
    public boolean isModifiable() {
        return this == IN_ASTEPTARE;
    }

    /**
     * Verifică dacă statusul este final (nu mai poate fi schimbat)
     * @return true dacă statusul este final
     */
    public boolean isFinal() {
        return this == APROBAT || this == RESPINS;
    }

    @Override
    public String toString() {
        return this.value;
    }
}