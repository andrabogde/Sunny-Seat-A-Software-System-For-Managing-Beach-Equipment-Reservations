package com.example.fullstacktemplate.repository;

import com.example.fullstacktemplate.model.Notificare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificareRepository extends JpaRepository<Notificare, Long> {
    
    // Găsește toate notificările unui utilizator
    Page<Notificare> findByUtilizatorIdOrderByDataOraDesc(Long utilizatorId, Pageable pageable);
    
    // Găsește notificări pentru o rezervare specifică
    List<Notificare> findByRezervareIdOrderByDataOraDesc(Long rezervareId);
    
    // Găsește ultimele 10 notificări
    List<Notificare> findTop10ByUtilizatorIdOrderByDataOraDesc(Long utilizatorId);
    
    // Șterge notificările vechi (opțional)
    @Query("DELETE FROM Notificare n WHERE n.dataOra < :dataLimita")
    void deleteOldNotifications(@Param("dataLimita") java.time.LocalDateTime dataLimita);

     @Modifying
    @Query("DELETE FROM Notificare n WHERE n.utilizatorId = :userId")
    int deleteByUserId(@Param("userId") Long userId);
}
