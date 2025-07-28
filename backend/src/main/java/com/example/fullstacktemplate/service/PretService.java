package com.example.fullstacktemplate.service;


import com.example.fullstacktemplate.model.Pret;
import com.example.fullstacktemplate.repository.PretRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PretService {

    private final PretRepository pretRepository;

    @Autowired
    public PretService(PretRepository pretRepository) {
        this.pretRepository = pretRepository;
    }

    public List<Pret> findAll() {
        return pretRepository.findAll();
    }

    public Optional<Pret> findById(Integer id) {
        return pretRepository.findById(id);
    }

    public Pret save(Pret pret) {
        return pretRepository.save(pret);
    }

    public void deleteById(Integer id) {
        pretRepository.deleteById(id);
    }

    //  Prețul curent pentru un echipament de plajă
    public Optional<Pret> findLatestPretByEchipamentPlajaId(Integer echipamentPlajaId) {
        return pretRepository.findTopByEchipamentPlajaIdOrderByDataOraDesc(echipamentPlajaId);
    }

    public List<Pret> getPreturiByEchipamentPlajaId(Integer echipamentPlajaId) {
        return pretRepository.findByEchipamentPlajaIdOrderByDataOraDesc(echipamentPlajaId);
    }
}

