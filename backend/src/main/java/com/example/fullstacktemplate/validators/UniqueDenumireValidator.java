package com.example.fullstacktemplate.validators;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.fullstacktemplate.repository.TipEchipamentPlajaRepository;
@Component
public class UniqueDenumireValidator implements ConstraintValidator<UniqueDenumire, String> {

    @Autowired
    private TipEchipamentPlajaRepository repository;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Lăsăm alte validări să gestioneze null/empty
        }
        return !repository.existsByDenumire(value); // Returnăm false dacă denumirea există deja
    }
}
