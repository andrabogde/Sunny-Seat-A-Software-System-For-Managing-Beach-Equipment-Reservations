package com.example.fullstacktemplate.service;



import com.example.fullstacktemplate.model.StareEchipamentPlaja;
import com.example.fullstacktemplate.repository.StareEchipamentPlajaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StareEchipamentPlajaService {

    private final StareEchipamentPlajaRepository repository;

    @Autowired
    public StareEchipamentPlajaService(StareEchipamentPlajaRepository repository) {
        this.repository = repository;
    }

    public List<StareEchipamentPlaja> findAll() {
        return repository.findAll();
    }

    public Optional<StareEchipamentPlaja> findById(Integer id) {
        return repository.findById(id);
    }

    public StareEchipamentPlaja save(StareEchipamentPlaja stareEchipamentPlaja) {
        return repository.save(stareEchipamentPlaja);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
