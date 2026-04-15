package com.reclamations.app.service;

import com.reclamations.app.dto.SuiviReclamationDTO;
import java.util.List;

public interface SuiviReclamationService {
    List<SuiviReclamationDTO> findByReclamation(Long reclamationId);
    SuiviReclamationDTO create(SuiviReclamationDTO dto);
    void delete(Long id);
}
