package com.example.fullstacktemplate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.fullstacktemplate.model.CerereManager;
import com.example.fullstacktemplate.model.Plaja;
import com.example.fullstacktemplate.model.StatusCerere;
import com.example.fullstacktemplate.model.User;

import java.util.List;
import java.util.Optional;

public interface CerereManagerRepository extends JpaRepository<CerereManager, Long> {
    
    // ✅ Găsește cereri după status (folosind enum)
    List<CerereManager> findByStatus(StatusCerere status);
    
    // ✅ Verifică dacă un utilizator are deja o cerere cu un anumit status
    boolean existsByUserAndStatus(User user, StatusCerere status);
    
    // ✅ Găsește toate cererile unui utilizator, ordonate descrescător
    List<CerereManager> findByUserOrderByIdDesc(User user);
    
    // ✅ Găsește cerere după CUI
    Optional<CerereManager> findByCui(String cui);
    
    // ✅ Verifică dacă există cerere cu CUI-ul specificat
    boolean existsByCui(String cui);
    
    // ✅ Găsește cereri după multiple statusuri
    List<CerereManager> findByStatusIn(List<StatusCerere> statusuri);
    
    // ✅ Query custom pentru statistici
    @Query("SELECT c.status, COUNT(c) FROM CerereManager c GROUP BY c.status")
    List<Object[]> getStatisticiStatusuri();
    
    // ✅ Găsește cererile unui utilizator cu un anumit status
    List<CerereManager> findByUserAndStatus(User user, StatusCerere status);

    List<CerereManager> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("DELETE FROM CerereManager c WHERE c.user.id = :userId")
    int deleteByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CerereManager c WHERE c.user.id = :userId AND c.status = 'aprobat'")
    boolean existsByUserIdAndStatusAndHasActiveManagementRoles(@Param("userId") Long userId);

    Optional<CerereManager> findByUserId(Long id);
}