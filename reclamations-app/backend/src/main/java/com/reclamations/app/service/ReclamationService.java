package com.reclamations.app.service;

import com.reclamations.app.dto.RapportSatisfactionDTO;
import com.reclamations.app.dto.ReclamationDTO;
import com.reclamations.app.enums.StatutReclamation;

import java.util.List;

public interface ReclamationService {
    List<ReclamationDTO> findAll();
    ReclamationDTO findById(Long id);
    ReclamationDTO create(ReclamationDTO dto);
    ReclamationDTO update(Long id, ReclamationDTO dto);
    void delete(Long id);
    List<ReclamationDTO> findByClient(Long clientId);
    List<ReclamationDTO> findByAgent(Long agentId);
    List<ReclamationDTO> findByStatut(StatutReclamation statut);
    ReclamationDTO affecter(Long reclamationId, Long agentId);
    ReclamationDTO changerStatut(Long id, StatutReclamation statut);
    RapportSatisfactionDTO genererRapport();
}
