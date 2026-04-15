package com.reclamations.app.repository;

import com.reclamations.app.entity.AgentSAV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentSAVRepository extends JpaRepository<AgentSAV, Long> {
    List<AgentSAV> findByCompetenceContainingIgnoreCase(String competence);
}
