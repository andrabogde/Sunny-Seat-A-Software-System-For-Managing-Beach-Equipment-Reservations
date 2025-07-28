package com.example.fullstacktemplate.service;


import com.example.fullstacktemplate.model.FirmaUtilizator;
import com.example.fullstacktemplate.repository.FirmaUtilizatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FirmaUtilizatorService {

    @Autowired
    private FirmaUtilizatorRepository firmaUtilizatorRepository;

    public List<FirmaUtilizator> getAllFirmaUtilizatori() {
        return firmaUtilizatorRepository.findAll();
    }

    public Optional<FirmaUtilizator> getFirmaUtilizatorById(Integer id) {
        return firmaUtilizatorRepository.findById(id);
    }

    public FirmaUtilizator saveFirmaUtilizator(FirmaUtilizator firmaUtilizator) {
        return firmaUtilizatorRepository.save(firmaUtilizator);
    }

    public void deleteFirmaUtilizator(Integer id) {
        firmaUtilizatorRepository.deleteById(id);
    }
}

