package com.example.fullstacktemplate.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.fullstacktemplate.config.security.RestAuthenticationEntryPoint;
import com.example.fullstacktemplate.config.security.TokenAuthenticationFilter;
import com.example.fullstacktemplate.config.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.example.fullstacktemplate.config.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.example.fullstacktemplate.service.CookieOAuth2AuthorizationRequestService;
import com.example.fullstacktemplate.service.CustomUserDetailsService;
import com.example.fullstacktemplate.service.OAuth2UserService;
import com.example.fullstacktemplate.service.TokenService;

import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomUserDetailsService customUserDetailsService;
    private final AppProperties appProperties;
    private final OAuth2UserService OAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final TokenService tokenService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, AppProperties appProperties, @Lazy  OAuth2UserService OAuth2UserService, @Lazy OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler, OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler, TokenService tokenService) {
        this.customUserDetailsService = customUserDetailsService;
        this.appProperties = appProperties;
        this.OAuth2UserService = OAuth2UserService;
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
        this.oAuth2AuthenticationFailureHandler = oAuth2AuthenticationFailureHandler;
        this.tokenService = tokenService;
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenService, customUserDetailsService);
    }

    @Bean
    public CookieOAuth2AuthorizationRequestService cookieAuthorizationRequestRepository() {
        return new CookieOAuth2AuthorizationRequestService();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecretGenerator twoFactorSecretGenerator() {
        return new DefaultSecretGenerator(64);
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build();
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        System.out.println("🔧 SecurityConfig CORS configuration...");
        System.out.println("appProperties allowed origins: " + appProperties.getAllowedOrigins());
        
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ✅ FIX: Folosește allowedOriginPatterns în loc de allowedOrigins
        if (appProperties.getAllowedOrigins() != null &&
            !appProperties.getAllowedOrigins().isEmpty() &&
            !appProperties.getAllowedOrigins().contains("*")) {            // Convertește la origin patterns
            configuration.setAllowedOriginPatterns(appProperties.getAllowedOrigins());
            System.out.println("✅ Using AppProperties origin patterns: " + appProperties.getAllowedOrigins());
        } else {
            System.out.println("⚠️ AppProperties allowedOrigins is NULL, using default patterns");
            configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*", 
                "http://127.0.0.1:*",
                "https://yourdomain.com"
            ));
        }
        
        // Toate metodele HTTP permise
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // CRUCIAL: Setează la TRUE pentru a permite credențiale (cu origin patterns merge!)
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        System.out.println("✅ SecurityConfig CORS configured: allowCredentials=true with allowedOriginPatterns");
        return source;
    }

    @Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .cors()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .csrf()
            .disable()
            .formLogin()
            .disable()
            .httpBasic()
            .disable()
            .logout().disable()
            .exceptionHandling()
            .authenticationEntryPoint(new RestAuthenticationEntryPoint())
            .and()
            .authorizeRequests()
            
            // ✅ ADĂUGAT: OPTIONS requests (pentru CORS)
            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            
            // ✅ GRUPAT: Toate endpoint-urile publice (fără autentificare)
            .antMatchers("/",
                    "/error",
                    "/favicon.ico",
                    "/**/*.png",
                    "/**/*.gif",
                    "/**/*.svg",
                    "/**/*.jpg",
                    "/**/*.html",
                    "/**/*.css",
                    "/**/*.js")
            .permitAll()
            
            // ✅ EXPLICIT: Endpoint-uri AUTH publice (cel mai important!)
            .antMatchers("/auth/login",
                        "/auth/signup", 
                        "/auth/activate-account",
                        "/auth/forgotten-password",
                        "/auth/password-reset",
                        "/auth/signup-manager",
                        "/auth/logout",
                        "/auth/login/verify",
                        "/auth/login/recovery-code")
            .permitAll()
            
            // ✅ OAuth2 endpoints
            .antMatchers("/oauth2/**").permitAll()
            
            // ✅ API publice pentru plaje, etc.
            .antMatchers("/statiuni",
                        "/localitati", 
                        "/stari-echipamente-plaja", 
                        "/tipuri-echipamente-plaja", 
                        "/firme/**",
                        "/poze", 
                        "/plaje/**", 
                        "/plaje",
                        "/stari-rezervari", 
                        "/api/rezervari/**",
                        "/api/rezervari/pozitii-rezervate",
                        "/echipamente-plaja/**",
                        "/api/statistics/**",
                         "/api/cereri-manageri/**",
                         "/api/localitati/**",
                        "/preturi-echipamente")
            .permitAll()
            
            // ✅ Swagger/API docs
            .antMatchers("/v2/api-docs",
            "/v3/api-docs/**",         // ✅ ADĂUGAT pentru Swagger v3
            "/swagger-ui/**",          // ✅ ADĂUGAT pentru Swagger UI v3
            "/swagger-ui.html",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger.json",
            "/swagger.yaml",
            "/webjars/**",
            "/swagger",
            "/swagger/**")
.permitAll()
            
            // ✅ DEBUG endpoints (doar pentru development)
            .antMatchers("/debug/**", "/test/**").permitAll()
            
            // ✅ AUTENTIFICARE NECESARĂ: Endpoint-uri care necesită login
            .antMatchers("/auth/access-token").authenticated()  // Refresh token
            .antMatchers("/auth/change-password").authenticated()  // ✅ NOU!
            .antMatchers("/plaje/user").authenticated()  // ✅ NOU!
.antMatchers("/auth/validate-password").authenticated()
            
            // ✅ ADMIN: Endpoint-uri care necesită rol ADMIN
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/admin/users/**").hasRole("ADMIN")
            
            // ✅ USER: Endpoint-uri care necesită autentificare
            .antMatchers("/api/favorite/**").authenticated()
            .antMatchers("/user/**").hasAnyRole("USER", "ADMIN")
            
            // ✅ TOATE CELELALTE: Necesită autentificare
            .anyRequest().authenticated()
            
            .and()
            .oauth2Login()
            .authorizationEndpoint()
            .baseUri("/oauth2/authorize")
            .authorizationRequestRepository(cookieAuthorizationRequestRepository())
            .and()
            .redirectionEndpoint()
            .baseUri("/oauth2/callback/*")
            .and()
            .successHandler(oAuth2AuthenticationSuccessHandler)
            .failureHandler(oAuth2AuthenticationFailureHandler);

    // ✅ IMPORTANT: TokenAuthenticationFilter la sfârșit
    http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
}
}