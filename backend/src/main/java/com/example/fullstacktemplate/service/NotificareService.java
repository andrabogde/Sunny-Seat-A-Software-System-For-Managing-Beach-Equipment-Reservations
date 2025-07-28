package com.example.fullstacktemplate.service;

import com.example.fullstacktemplate.dto.NotificareDTO;
import com.example.fullstacktemplate.model.Notificare;
import com.example.fullstacktemplate.model.Rezervare;
import com.example.fullstacktemplate.repository.NotificareRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificareService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificareService.class);
    
    @Autowired
    private NotificareRepository notificareRepository;
    
    /**
     * 🆕 METODĂ DETALIATĂ: Creează o notificare pentru rezervare confirmată cu toate datele
     */
    public void createRezervareConfirmataNotification(Long utilizatorId, Long rezervareId, String codRezervare, 
                                                     String numePlaja, LocalDate dataRezervare, String pozitiaSezlong) {
        
        // Formatează data pentru afișare
        String dataFormatata = dataRezervare != null ? 
            dataRezervare.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")) : 
            "A fi confirmată";
        
        String continut = String.format(
            "🏖️ Rezervarea ta a fost confirmată cu succes!\n\n" +
            "📍 Locația: %s\n" +
            "📅 Data: %s\n" +
            "🏖️ Poziția: %s\n" +
            "🎫 Cod rezervare: %s\n\n" +
            "Te așteptăm să te bucuri de o zi minunată la plajă!",
            numePlaja != null ? numePlaja : "Plaja SunnySeat",
            dataFormatata,
            pozitiaSezlong != null ? pozitiaSezlong : "A fi atribuită",
            codRezervare
        );
        
        Notificare notificare = new Notificare(utilizatorId, rezervareId, continut);
        notificareRepository.save(notificare);
        
        logger.info("📢 Notificare rezervare detaliată creată pentru utilizatorul {} - cod: {} ({})", 
                   utilizatorId, codRezervare, pozitiaSezlong);
    }
    
    /**
     * Versiune simplă pentru backward compatibility
     */
    public void createRezervareConfirmataNotification(Long utilizatorId, Long rezervareId, String codRezervare, String numeLocatie) {
        createRezervareConfirmataNotification(utilizatorId, rezervareId, codRezervare, numeLocatie, null, null);
    }

    /**
     * 🆕 METODĂ DETALIATĂ: Creează notificare pentru rezervare anulată cu toate datele
     */
    public void createRezervareAnulataNotification(Long utilizatorId, Long rezervareId, String codRezervare, 
                                                  String numePlaja, LocalDate dataRezervare) {
        
        String dataFormatata = dataRezervare != null ? 
            dataRezervare.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")) : 
            "Data rezervării";
            
        String continut = String.format(
            "❌ Rezervarea ta a fost anulată cu succes.\n\n" +
            "📍 Locația: %s\n" +
            "📅 Data: %s\n" +
            "🎫 Cod rezervare: %s\n\n" +
            "💰 Banii vor fi returnați în 3-5 zile lucrătoare.\n" +
            "Ne pare rău că nu te-am putut servi de această dată!",
            numePlaja != null ? numePlaja : "Plaja SunnySeat",
            dataFormatata,
            codRezervare
        );
        
        Notificare notificare = new Notificare(utilizatorId, rezervareId, continut);
        notificareRepository.save(notificare);
        
        logger.info("📢 Notificare anulare detaliată creată pentru utilizatorul {} - cod: {}", utilizatorId, codRezervare);
    }
    
    /**
     * Versiune simplă pentru backward compatibility
     */
    public void createRezervareAnulataNotification(Long utilizatorId, Long rezervareId, String codRezervare, String numeLocatie) {
        createRezervareAnulataNotification(utilizatorId, rezervareId, codRezervare, numeLocatie, null);
    }
    
    /**
     * Creează notificare pentru rezervare modificată
     */
    public void createRezervareModificataNotification(Long utilizatorId, Long rezervareId, String codRezervare, String numeLocatie, String detaliiModificare) {
        String continut = String.format("🔄 Rezervarea %s pentru %s a fost modificată cu succes.\n\n%s", 
                                       codRezervare, numeLocatie, detaliiModificare);
        
        Notificare notificare = new Notificare(utilizatorId, rezervareId, continut);
        notificareRepository.save(notificare);
        
        logger.info("📢 Notificare modificare creată pentru utilizatorul {} - cod: {}", utilizatorId, codRezervare);
    }
    
    /**
     * Creează notificare generală pentru sistem
     */
    public void createSystemNotification(Rezervare r,Long utilizatorId, String mesaj) {
        Notificare notificare = new Notificare(utilizatorId, mesaj);
        notificare.setRezervareId(Long.valueOf(r.getId()));
        notificareRepository.save(notificare);
        
        logger.info("📢 Notificare sistem creată pentru utilizatorul {}", utilizatorId);
    }
    
    /**
     * 🆕 REMINDER: Creează notificare reminder pentru ziua rezervării
     */
    public void createReminderNotification(Long utilizatorId, Long rezervareId, String codRezervare, 
                                         String numePlaja, LocalDate dataRezervare, String pozitiaSezlong) {
        
        String dataFormatata = dataRezervare.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        
        String continut = String.format(
            "⏰ Reminder: Rezervarea ta este pentru astăzi!\n\n" +
            "📍 Locația: %s\n" +
            "📅 Data: %s\n" +
            "🏖️ Poziția: %s\n" +
            "🎫 Cod rezervare: %s\n\n" +
            "Nu uita să vii la timp pentru a te bucura de ziua perfectă la plajă!",
            numePlaja, dataFormatata, pozitiaSezlong, codRezervare
        );
        
        Notificare notificare = new Notificare(utilizatorId, rezervareId, continut);
        notificareRepository.save(notificare);
        
        logger.info("⏰ Notificare reminder creată pentru utilizatorul {} - cod: {}", utilizatorId, codRezervare);
    }
    
    /**
     * Obține notificările unui utilizator cu paginare
     */
    public Page<NotificareDTO> getNotificariUtilizator(Long utilizatorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notificare> notificari = notificareRepository.findByUtilizatorIdOrderByDataOraDesc(utilizatorId, pageable);
        
        logger.info("📋 Găsite {} notificări pentru utilizatorul {} (pagina {})", 
                   notificari.getTotalElements(), utilizatorId, page);
        
        return notificari.map(this::convertToDTO);
    }
    
    /**
     * Obține ultimele 10 notificări ale unui utilizator
     */
    public List<NotificareDTO> getUltimeleNotificari(Long utilizatorId) {
        List<Notificare> notificari = notificareRepository.findTop10ByUtilizatorIdOrderByDataOraDesc(utilizatorId);
        
        logger.info("📋 Găsite {} notificări recente pentru utilizatorul {}", notificari.size(), utilizatorId);
        
        return notificari.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Șterge o notificare
     */
    public void deleteNotificare(Long notificareId, Long utilizatorId) {
        Optional<Notificare> notificareOpt = notificareRepository.findById(notificareId);
        
        if (notificareOpt.isPresent()) {
            Notificare notificare = notificareOpt.get();
            
            // Verifică că notificarea aparține utilizatorului
            if (!notificare.getUtilizatorId().equals(utilizatorId)) {
                throw new IllegalArgumentException("Notificarea nu aparține utilizatorului");
            }
            
            notificareRepository.delete(notificare);
            logger.info("🗑️ Notificare {} ștearsă pentru utilizatorul {}", notificareId, utilizatorId);
        }
    }
    
    /**
     * Șterge notificările selectate
     */
    public void deleteNotificari(List<Long> notificareIds, Long utilizatorId) {
        List<Notificare> notificari = notificareRepository.findAllById(notificareIds);
        
        // Verifică că toate notificările aparțin utilizatorului
        boolean allBelongToUser = notificari.stream()
                .allMatch(n -> n.getUtilizatorId().equals(utilizatorId));
        
        if (!allBelongToUser) {
            throw new IllegalArgumentException("Unele notificări nu aparțin utilizatorului");
        }
        
        notificareRepository.deleteAll(notificari);
        logger.info("🗑️ {} notificări șterse pentru utilizatorul {}", notificareIds.size(), utilizatorId);
    }
    
    /**
     * Convertește entitatea în DTO
     */
    private NotificareDTO convertToDTO(Notificare notificare) {
        return new NotificareDTO(
                notificare.getId(),
                notificare.getContinut(),
                notificare.getDataOra(),
                notificare.getRezervareId()
        );
    }
}