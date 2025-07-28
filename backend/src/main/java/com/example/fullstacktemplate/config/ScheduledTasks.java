package com.example.fullstacktemplate.config;

import com.example.fullstacktemplate.model.JwtToken;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.repository.TokenRepository;
import com.example.fullstacktemplate.service.PlaceDetailsService;
import com.example.fullstacktemplate.service.PlajaService;
import com.example.fullstacktemplate.service.TokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ScheduledTasks {
    private final TokenRepository tokenRepository;
    private final TokenService tokenService;
    private final PlajaService  service;
    private final PlaceDetailsService placeDetailsService;

    @Autowired
    public ScheduledTasks(TokenRepository tokenRepository, TokenService tokenService, PlajaService service, PlaceDetailsService placeDetailsService) {
        this.service = service;
        this.placeDetailsService = placeDetailsService;
        this.tokenRepository = tokenRepository;
        this.tokenService = tokenService;

    }

    @Scheduled(fixedDelayString = "${app.deleteExpiredTokensDelayMsec}")
    public void deleteExpiredTokens() {
        log.info("Deleting expired tokens");
        // List<JwtToken> expiredTokens = tokenRepository
        //         .findAll()
        //         .stream()
        //         .filter(jwtToken -> !tokenService.validateJwtToken(jwtToken.getValue()))
        //         .collect(Collectors.toList());
        // tokenRepository.deleteAll(expiredTokens);
        // log.info("Following tokens were deleted {}", expiredTokens);
    }

    @Scheduled(fixedDelayString = "${app.updatePlaceDetailsDelayMsec}")
    public void updatePlaceDetails() {
        log.info("Updating place details");
           List<Plaja> plaje = service.findAll();
        for (Plaja plaja : plaje) {
           //  plaja.setDetaliiWeb(placeDetailsService.getPlaceDetails(plaja.getDenumire()));
            service.save(plaja);
        }
        // List<JwtToken> expiredTokens = tokenRepository
        //         .findAll()
        //         .stream()
        //         .filter(jwtToken -> !tokenService.validateJwtToken(jwtToken.getValue()))
        //         .collect(Collectors.toList());
        // tokenRepository.deleteAll(expiredTokens);
        // log.info("Following tokens were deleted {}", expiredTokens);
    }
}
