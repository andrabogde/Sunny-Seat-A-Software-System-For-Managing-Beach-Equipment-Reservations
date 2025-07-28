package com.example.fullstacktemplate.service;



import com.example.fullstacktemplate.model.Poza;
import com.example.fullstacktemplate.repository.PozaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PozaService {

    private final PozaRepository repository;

    @Autowired
    public PozaService(PozaRepository repository) {
        this.repository = repository;
    }

    public List<Poza> findAll() {
        return repository.findAll();
    }

    public Optional<Poza> findById(Integer id) {
        return repository.findById(id);
    }

    public List<Poza> findByPlajaId(Integer plajaId) {
        return repository.findByPlajaIdOrderByOrdineAsc(plajaId);
    }

    public Poza save(Poza poza) {
        return repository.save(poza);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}

