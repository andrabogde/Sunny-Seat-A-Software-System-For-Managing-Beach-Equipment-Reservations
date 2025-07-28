package com.example.fullstacktemplate.service;


import com.example.fullstacktemplate.model.StareRezervare;
import com.example.fullstacktemplate.repository.StareRezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StareRezervareService {

    @Autowired
    private StareRezervareRepository stareRezervareRepository;

    public List<StareRezervare> getAllStariRezervari() {
        return stareRezervareRepository.findAll();
    }

    // Adaugă aceste metode în StareRezervareService.java existent

public Optional<StareRezervare> getStareRezervareById(Integer id) {
    return stareRezervareRepository.findById(id);
}

public StareRezervare saveStareRezervare(StareRezervare stareRezervare) {
    return stareRezervareRepository.save(stareRezervare);
}

public void deleteStareRezervare(Integer id) {
    stareRezervareRepository.deleteById(id);
}

public Optional<StareRezervare> findByDenumire(String denumire) {
    return stareRezervareRepository.findByDenumire(denumire);
}

public List<StareRezervare> findByActiv(Boolean activ) {
    return stareRezervareRepository.findByActiv(activ);
}
}

