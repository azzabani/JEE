package com.reclamations.app.service.impl;

import com.reclamations.app.dto.AgentSAVDTO;
import com.reclamations.app.entity.AgentSAV;
import com.reclamations.app.exception.ResourceNotFoundException;
import com.reclamations.app.mapper.AgentSAVMapper;
import com.reclamations.app.repository.AgentSAVRepository;
import com.reclamations.app.service.AgentSAVService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentSAVServiceImpl implements AgentSAVService {

    private final AgentSAVRepository agentSAVRepository;
    private final AgentSAVMapper agentSAVMapper;

    @Override
    public List<AgentSAVDTO> findAll() {
        return agentSAVRepository.findAll().stream().map(agentSAVMapper::toDTO).toList();
    }

    @Override
    public AgentSAVDTO findById(Long id) {
        return agentSAVRepository.findById(id)
                .map(agentSAVMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV non trouvé avec l'id: " + id));
    }

    @Override
    public AgentSAVDTO create(AgentSAVDTO dto) {
        AgentSAV agent = agentSAVMapper.toEntity(dto);
        return agentSAVMapper.toDTO(agentSAVRepository.save(agent));
    }

    @Override
    public AgentSAVDTO update(Long id, AgentSAVDTO dto) {
        AgentSAV existing = agentSAVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV non trouvé avec l'id: " + id));
        existing.setNom(dto.getNom());
        existing.setCompetence(dto.getCompetence());
        return agentSAVMapper.toDTO(agentSAVRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!agentSAVRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agent SAV non trouvé avec l'id: " + id);
        }
        agentSAVRepository.deleteById(id);
    }
}
