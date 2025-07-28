package com.example.fullstacktemplate.converters;


import com.example.fullstacktemplate.model.StatusCerere;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

/**
 * Converter pentru StatusCerere enum care folosește valorile custom
 * în loc de numele enum-ului pentru mapping-ul cu baza de date
 */
@Converter(autoApply = true)
public class StatusCerereConverter implements AttributeConverter<StatusCerere, String> {

    @Override
    public String convertToDatabaseColumn(StatusCerere status) {
        if (status == null) {
            return null;
        }
        return status.getValue(); // Returnează "in_asteptare", "aprobat", "respins"
    }

    @Override
    public StatusCerere convertToEntityAttribute(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return StatusCerere.fromValue(value); // Convertește "in_asteptare" -> IN_ASTEPTARE
    }
}