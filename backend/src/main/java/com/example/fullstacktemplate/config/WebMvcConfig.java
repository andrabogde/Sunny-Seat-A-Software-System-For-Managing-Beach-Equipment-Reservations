// package com.example.fullstacktemplate.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebMvcConfig implements WebMvcConfigurer {

//     private final long MAX_AGE_SECS = 3600;
//     private final AppProperties appProperties;

//     public WebMvcConfig(AppProperties appProperties) {
//         this.appProperties = appProperties;
//     }

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**")
//         .allowedOrigins("http://localhost:4000") // Aplicatia ta React
//                 .allowedOriginPatterns(appProperties.getAllowedOrigins().toArray(new String[]{}))
//                 .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
//                 //.allowCredentials(true)
//                 .maxAge(MAX_AGE_SECS);
//     }


package com.example.fullstacktemplate.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("🔧 CORS Configuration Applied!");
        
        registry.addMapping("/**")
                // ✅ allowedOriginPatterns în loc de allowedOrigins
                .allowedOriginPatterns(
                    "http://localhost:3000",   // React dev server default
                    "http://localhost:4000",   // Al tău React dev server
                    "http://localhost:5173",   // Vite dev server default
                    "http://localhost:*",      // Orice port pe localhost
                    "http://127.0.0.1:*"       // Orice port pe 127.0.0.1
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
             //   .allowCredentials(true)  // ✅ Acum funcționează cu allowedOriginPatterns
                .maxAge(3600);
        
        System.out.println("✅ CORS: Origin patterns allowed with credentials");
        System.out.println("📋 CORS: Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        System.out.println("🔐 CORS: Credentials enabled");
    }
}