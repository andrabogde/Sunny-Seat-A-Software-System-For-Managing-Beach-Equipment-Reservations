package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.model.Statiune;
import com.example.fullstacktemplate.repository.StatiuneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatiuneService {

    private final StatiuneRepository statiuneRepository;

    @Autowired
    public StatiuneService(StatiuneRepository statiuneRepository) {
        this.statiuneRepository = statiuneRepository;
    }

    public List<Statiune> findAll() {
        return statiuneRepository.findAll();
    }

    public Optional<Statiune> findById(Integer id) {
        return statiuneRepository.findById(id);
    }

    public Statiune save(Statiune statiune) {
        return statiuneRepository.save(statiune);
    }

    public void deleteById(Integer id) {
        statiuneRepository.deleteById(id);
    }
}

