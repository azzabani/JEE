package com.reclamations.app.repository;

import com.reclamations.app.entity.Reclamation;
import com.reclamations.app.enums.StatutReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByClientId(Long clientId);
    List<Reclamation> findByAgentSAVId(Long agentId);
    List<Reclamation> findByStatut(StatutReclamation statut);

    @Query("SELECT AVG(r.note) FROM Reclamation r WHERE r.note IS NOT NULL")
    Double findAverageNote();

    @Query("SELECT r.statut, COUNT(r) FROM Reclamation r GROUP BY r.statut")
    List<Object[]> countByStatut();

    @Query("SELECT r.produit, COUNT(r) FROM Reclamation r GROUP BY r.produit ORDER BY COUNT(r) DESC")
    List<Object[]> countByProduit();
}
