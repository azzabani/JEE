package com.reclamations.app.service;

import com.reclamations.app.dto.AgentSAVDTO;
import java.util.List;

public interface AgentSAVService {
    List<AgentSAVDTO> findAll();
    AgentSAVDTO findById(Long id);
    AgentSAVDTO create(AgentSAVDTO dto);
    AgentSAVDTO update(Long id, AgentSAVDTO dto);
    void delete(Long id);
}
