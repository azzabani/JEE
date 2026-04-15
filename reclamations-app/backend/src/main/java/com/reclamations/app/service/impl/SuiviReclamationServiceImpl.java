package com.reclamations.app.service.impl;

import com.reclamations.app.dto.SuiviReclamationDTO;
import com.reclamations.app.entity.Reclamation;
import com.reclamations.app.entity.SuiviReclamation;
import com.reclamations.app.exception.ResourceNotFoundException;
import com.reclamations.app.mapper.SuiviReclamationMapper;
import com.reclamations.app.repository.ReclamationRepository;
import com.reclamations.app.repository.SuiviReclamationRepository;
import com.reclamations.app.service.SuiviReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuiviReclamationServiceImpl implements SuiviReclamationService {

    private final SuiviReclamationRepository suiviRepository;
    private final ReclamationRepository reclamationRepository;
    private final SuiviReclamationMapper suiviMapper;

    @Override
    public List<SuiviReclamationDTO> findByReclamation(Long reclamationId) {
        return suiviRepository.findByReclamationIdOrderByDateAsc(reclamationId)
                .stream().map(suiviMapper::toDTO).toList();
    }

    @Override
    public SuiviReclamationDTO create(SuiviReclamationDTO dto) {
        Reclamation reclamation = reclamationRepository.findById(dto.getReclamationId())
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + dto.getReclamationId()));

        SuiviReclamation suivi = suiviMapper.toEntity(dto);
        suivi.setReclamation(reclamation);
        return suiviMapper.toDTO(suiviRepository.save(suivi));
    }

    @Override
    public void delete(Long id) {
        if (!suiviRepository.existsById(id)) {
            throw new ResourceNotFoundException("Suivi non trouvé avec l'id: " + id);
        }
        suiviRepository.deleteById(id);
    }
}
