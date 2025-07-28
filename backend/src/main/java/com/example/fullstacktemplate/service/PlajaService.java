package com.example.fullstacktemplate.service;



import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.model.Firma;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.User;
import com.example.fullstacktemplate.repository.CerereManagerRepository;
import com.example.fullstacktemplate.repository.FirmaRepository;
import com.example.fullstacktemplate.repository.PlajaRepository;
import com.example.fullstacktemplate.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlajaService {

    private final PlajaRepository repository;
    private final UserRepository userRepository;
    private final CerereManagerRepository cerereManagerRepository;
    private final FirmaRepository firmaRepository;

    @Autowired
    public PlajaService(PlajaRepository repository, UserRepository userRepository, CerereManagerRepository cerereManagerRepository, FirmaRepository firmaRepository) {
        this.repository = repository;
        this.userRepository=userRepository;
        this.cerereManagerRepository=cerereManagerRepository;
        this.firmaRepository=firmaRepository;
    }

    public List<Plaja> findAll() {
        return repository.findAll().stream().map(plaja->{
            Firma firma=plaja.getFirma();
            if(firma!=null && firma.getCui()!=null){
                CerereManager cerereManager=cerereManagerRepository.findByCui(firma.getCui()).orElse(null);
                if(cerereManager!=null){
                    User user=userRepository.findByEmail(cerereManager.getEmail()).get();
                    if(user!=null)
                    plaja.setUserId(user.getId().intValue());
                }
            }
            return plaja;
        }).collect(Collectors.toList());
    }

    public Optional<Plaja> findById(Integer id) {
        return repository.findById(id);
    }

    public List<Plaja> findByActiv(Boolean activ) {
        return repository.findByActiv(activ);
    }

    public List<Plaja> findByStatiuneId(Integer statiuneId) {
        return repository.findByStatiuneId(statiuneId);
    }

    public Plaja save(Plaja plaja) {
        return repository.save(plaja);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    public List<Map<String, Object>> getTopBeachPerformance(int limit) {
        LocalDateTime dataInceput = LocalDateTime.now().minusMonths(12);
        LocalDateTime dataSfarsit = LocalDateTime.now();
        
        List<Object[]> results = repository.getTopBeachPerformance(dataInceput, dataSfarsit, limit);
        
        return results.stream()
                .map(row -> {
                    Map<String, Object> beach = new HashMap<>();
                    beach.put("plaja_id", row[0]);
                    beach.put("nume_plaja", row[1]);
                    beach.put("statiune", row[2]);
                    beach.put("numar_rezervari", row[3]);
                    beach.put("venit_total", row[4]);
                    beach.put("pret_mediu_rezervare", row[5]);
                    beach.put("total_echipamente", row[6]);
                    beach.put("ultima_rezervare", row[7]);
                    return beach;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTopBeachPerformanceWithFilters(
            int ultimeleLuni, 
            Long stationId, 
            int minimRezervari, 
            int limit) {
        
        List<Object[]> results = repository.getTopBeachPerformanceWithFilters(
            ultimeleLuni, stationId, minimRezervari, limit);
        
        return results.stream()
                .map(row -> {
                    Map<String, Object> beach = new HashMap<>();
                    beach.put("plaja_id", row[0]);
                    beach.put("nume_plaja", row[1]);
                    beach.put("statiune", row[2]);
                    beach.put("numar_rezervari", row[3]);
                    beach.put("venit_total", row[4]);
                    beach.put("pret_mediu_rezervare", row[5]);
                    return beach;
                })
                .collect(Collectors.toList());
    }

    public List<Plaja> findByUserEmail(String username) {
        // TODO Auto-generated method stub
        List<Plaja> listaPlaje=new ArrayList<>();
        if (username != null) {
            User user=userRepository.findByEmail(username).get();
            CerereManager cerereManager=cerereManagerRepository.findByUserId(user.getId()).get();
            Firma firma=firmaRepository.findByCui(cerereManager.getCui()).get();
            listaPlaje=repository.findByFirmaId(firma.getId());
        }
        return listaPlaje;
    }
   
}

