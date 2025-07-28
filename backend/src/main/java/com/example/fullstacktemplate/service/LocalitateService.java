package com.example.fullstacktemplate.service;


import com.example.fullstacktemplate.model.Localitate;
import com.example.fullstacktemplate.repository.LocalitateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocalitateService {

    private final LocalitateRepository localitateRepository;

    public LocalitateService(LocalitateRepository localitateRepository) {
        this.localitateRepository = localitateRepository;
    }

    public List<Localitate> findAll() {
        return localitateRepository.findAll();
    }

    public Optional<Localitate> findById(Integer id) {
        return localitateRepository.findById(id);
    }

    public List<Localitate> findByTaraId(Integer taraId) {
        return localitateRepository.findByTaraId(taraId);
    }

    public Localitate save(Localitate localitate) {
        return localitateRepository.save(localitate);
    }

    public void deleteById(Integer id) {
        localitateRepository.deleteById(id);
    }
}

