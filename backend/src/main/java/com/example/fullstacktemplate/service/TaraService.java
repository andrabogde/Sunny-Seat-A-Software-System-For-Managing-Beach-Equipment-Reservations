package com.example.fullstacktemplate.service;


import com.example.fullstacktemplate.model.Tara;
import com.example.fullstacktemplate.repository.TaraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaraService {

    private final TaraRepository taraRepository;

    @Autowired
    public TaraService(TaraRepository taraRepository) {
        this.taraRepository = taraRepository;
    }

    public List<Tara> findAll() {
        return taraRepository.findAll();
    }

    public Optional<Tara> findById(Integer id) {
        return taraRepository.findById(id);
    }

    public Optional<Tara> findByDenumire(String denumire) {
        return taraRepository.findByDenumire(denumire);
    }

    public Optional<Tara> findByCodTara(String codTara) {
        return taraRepository.findByCodTara(codTara);
    }

    public Tara save(Tara tara) {
        return taraRepository.save(tara);
    }

    public void deleteById(Integer id) {
        taraRepository.deleteById(id);
    }
}

