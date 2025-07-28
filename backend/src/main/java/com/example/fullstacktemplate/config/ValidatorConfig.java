package com.example.fullstacktemplate.config;

import javax.validation.Validator;

import org.hibernate.validator.messageinterpolation.ResourceBundleMessageInterpolator;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorFactory;

@Configuration
public class ValidatorConfig {

    @Bean
    public LocalValidatorFactoryBean validator(ApplicationContext context) {
        LocalValidatorFactoryBean validatorFactoryBean = new LocalValidatorFactoryBean();

        // Custom ConstraintValidatorFactory
        ConstraintValidatorFactory constraintValidatorFactory = new ConstraintValidatorFactory() {
            @Override
            public <T extends ConstraintValidator<?, ?>> T getInstance(Class<T> key) {
                return context.getAutowireCapableBeanFactory().createBean(key);
            }

            @Override
            public void releaseInstance(ConstraintValidator<?, ?> instance) {
                context.getAutowireCapableBeanFactory().destroyBean(instance);
            }
        };

        validatorFactoryBean.setConstraintValidatorFactory(constraintValidatorFactory);
        return validatorFactoryBean;
    }
}


