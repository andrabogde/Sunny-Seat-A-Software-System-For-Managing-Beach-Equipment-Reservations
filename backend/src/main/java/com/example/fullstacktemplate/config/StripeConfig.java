package com.example.fullstacktemplate.config;

import com.stripe.Stripe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class StripeConfig {
    
    @Value("${stripe.secret.key}")
    private String secretKey;
    
    @Value("${stripe.public.key}")
    private String publicKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
        System.out.println("🔵 Stripe configurat cu cheia: " + secretKey.substring(0, 12) + "...");
    }
    
    public String getPublicKey() {
        return publicKey;
    }
}