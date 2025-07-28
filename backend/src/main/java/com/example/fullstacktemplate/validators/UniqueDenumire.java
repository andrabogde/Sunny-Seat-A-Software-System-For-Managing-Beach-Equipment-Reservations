package com.example.fullstacktemplate.validators;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = UniqueDenumireValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueDenumire {

    String message() default "Denumirea există deja.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
