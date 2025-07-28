package com.example.fullstacktemplate.config.security;

import com.example.fullstacktemplate.exception.BadRequestException;
import com.example.fullstacktemplate.service.CustomUserDetailsService;
import com.example.fullstacktemplate.service.TokenService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(TokenAuthenticationFilter.class);

    private final TokenService tokenService;
    private final CustomUserDetailsService customUserDetailsService;

// ✅ REVERT la original - EXACT cum era:
// ✅ ÎNLOCUIEȘTE WHITELIST-UL din TokenAuthenticationFilter cu acesta:

// Definește whitelist-ul pentru rute publice - DOAR cele care chiar nu necesită autentificare
private final List<AntPathRequestMatcher> whitelist = List.of(
        // ✅ AUTH endpoints PUBLICE (fără autentificare)
        new AntPathRequestMatcher("/auth/login"),
        new AntPathRequestMatcher("/auth/signup"),
        new AntPathRequestMatcher("/auth/signup-manager"),
        new AntPathRequestMatcher("/auth/activate-account"),
        new AntPathRequestMatcher("/auth/forgotten-password"),
        new AntPathRequestMatcher("/auth/password-reset"),
        new AntPathRequestMatcher("/auth/logout"),
        new AntPathRequestMatcher("/auth/login/verify"),
        new AntPathRequestMatcher("/auth/login/recovery-code"),
        new AntPathRequestMatcher("/auth/confirm-email-change"),
        
        // ✅ NOTĂ: /auth/change-password și /auth/validate-password NU sunt aici!
        // Acestea NECESITĂ autentificare pentru securitate!
        
        // ✅ API endpoints PUBLICE
        new AntPathRequestMatcher("/statiuni/**"),
        new AntPathRequestMatcher("/plaje/**"),
        new AntPathRequestMatcher("/poze/**"),
        new AntPathRequestMatcher("/firme/**"),
        new AntPathRequestMatcher("/echipamente-plaja/**"),
        new AntPathRequestMatcher("/stari-rezervari/**"),
        new AntPathRequestMatcher("/error/**"),
        new AntPathRequestMatcher("/actuator/health"),
        
        // ✅ RESOURCES publice
        new AntPathRequestMatcher("/favicon.ico"),
        new AntPathRequestMatcher("/**/*.png"),
        new AntPathRequestMatcher("/**/*.gif"),
        new AntPathRequestMatcher("/**/*.svg"),
        new AntPathRequestMatcher("/**/*.jpg"),
        new AntPathRequestMatcher("/**/*.html"),
        new AntPathRequestMatcher("/**/*.css"),
        new AntPathRequestMatcher("/**/*.js")
);

    public TokenAuthenticationFilter(TokenService tokenService, CustomUserDetailsService customUserDetailsService) {
        this.tokenService = tokenService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        logger.debug("Processing request: {} {}", method, requestURI);

        try {
            // Ignoră rutele din whitelist (sunt publice)
            if (isWhitelisted(request)) {
                logger.debug("Request {} {} is whitelisted, skipping authentication", method, requestURI);
                filterChain.doFilter(request, response);
                return;
            }

            // Verifică dacă există un token valid
            String jwt = getAccessJwtFromRequest(request).orElse(null);
            
            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("Found JWT token, attempting authentication");
                
                try {
                    if (tokenService.validateJwtToken(jwt)) {
                        logger.debug("JWT token is valid");
                        
                        Long userId = tokenService.getUserIdFromToken(jwt);
                        logger.debug("Extracted user ID from token: {}", userId);
                        
                        if (userId != null) {
                            Optional<UserDetails> optionalUserDetails = customUserDetailsService.loadUserById(userId);
                            
                            if (optionalUserDetails.isPresent()) {
                                UserDetails userDetails = optionalUserDetails.get();
                                logger.debug("Found user details for ID: {}", userId);
                                
                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                logger.debug("Successfully authenticated user with ID: {}", userId);
                            } else {
                                logger.warn("User details not found for ID: {}", userId);
                            }
                        }
                    } else {
                        logger.debug("JWT token validation failed");
                    }
                } catch (Exception e) {
                    logger.error("Error processing JWT token for request {} {}", method, requestURI, e);
                    // Nu aruncăm excepția pentru a nu bloca request-ul
                    // Utilizatorul va rămâne neautentificat
                }
            } else if (jwt == null) {
                logger.debug("No JWT token found in request headers");
            }

        } catch (Exception e) {
            logger.error("Unexpected error in authentication filter for request {} {}", method, requestURI, e);
            // Nu aruncăm excepția pentru a nu bloca request-ul complet
        }

        filterChain.doFilter(request, response);
    }

    private boolean isWhitelisted(HttpServletRequest request) {
        return whitelist.stream().anyMatch(matcher -> matcher.matches(request));
    }

    private Optional<String> getAccessJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            logger.debug("Found Bearer token in Authorization header");
            return Optional.of(token);
        }
        logger.debug("No valid Bearer token found in Authorization header");
        return Optional.empty();
    }
}