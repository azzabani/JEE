package com.reclamations.app.service.impl;

import com.reclamations.app.dto.RapportSatisfactionDTO;
import com.reclamations.app.dto.ReclamationDTO;
import com.reclamations.app.entity.AgentSAV;
import com.reclamations.app.entity.Client;
import com.reclamations.app.entity.Reclamation;
import com.reclamations.app.enums.StatutReclamation;
import com.reclamations.app.exception.ResourceNotFoundException;
import com.reclamations.app.mapper.ReclamationMapper;
import com.reclamations.app.repository.AgentSAVRepository;
import com.reclamations.app.repository.ClientRepository;
import com.reclamations.app.repository.ReclamationRepository;
import com.reclamations.app.service.ReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReclamationServiceImpl implements ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ClientRepository clientRepository;
    private final AgentSAVRepository agentSAVRepository;
    private final ReclamationMapper reclamationMapper;

    @Override
    public List<ReclamationDTO> findAll() {
        return reclamationRepository.findAll().stream().map(reclamationMapper::toDTO).toList();
    }

    @Override
    public ReclamationDTO findById(Long id) {
        return reclamationRepository.findById(id)
                .map(reclamationMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));
    }

    @Override
    public ReclamationDTO create(ReclamationDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + dto.getClientId()));

        Reclamation reclamation = reclamationMapper.toEntity(dto);
        reclamation.setClient(client);
        reclamation.setStatut(StatutReclamation.OUVERTE);

        if (dto.getAgentId() != null) {
            AgentSAV agent = agentSAVRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé avec l'id: " + dto.getAgentId()));
            reclamation.setAgentSAV(agent);
        }

        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    @Override
    public ReclamationDTO update(Long id, ReclamationDTO dto) {
        Reclamation existing = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));

        existing.setProduit(dto.getProduit());
        existing.setDescription(dto.getDescription());
        if (dto.getStatut() != null) existing.setStatut(dto.getStatut());
        if (dto.getNote() != null) existing.setNote(dto.getNote());

        return reclamationMapper.toDTO(reclamationRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!reclamationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id);
        }
        reclamationRepository.deleteById(id);
    }

    @Override
    public List<ReclamationDTO> findByClient(Long clientId) {
        return reclamationRepository.findByClientId(clientId).stream().map(reclamationMapper::toDTO).toList();
    }

    @Override
    public List<ReclamationDTO> findByAgent(Long agentId) {
        return reclamationRepository.findByAgentSAVId(agentId).stream().map(reclamationMapper::toDTO).toList();
    }

    @Override
    public List<ReclamationDTO> findByStatut(StatutReclamation statut) {
        return reclamationRepository.findByStatut(statut).stream().map(reclamationMapper::toDTO).toList();
    }

    @Override
    public ReclamationDTO affecter(Long reclamationId, Long agentId) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + reclamationId));
        AgentSAV agent = agentSAVRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé avec l'id: " + agentId));

        reclamation.setAgentSAV(agent);
        reclamation.setStatut(StatutReclamation.EN_COURS);
        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    @Override
    public ReclamationDTO changerStatut(Long id, StatutReclamation statut) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));
        reclamation.setStatut(statut);
        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    @Override
    public RapportSatisfactionDTO genererRapport() {
        long total = reclamationRepository.count();
        Double noteMoyenne = reclamationRepository.findAverageNote();

        Map<String, Long> parStatut = new HashMap<>();
        reclamationRepository.countByStatut().forEach(row -> parStatut.put(row[0].toString(), (Long) row[1]));

        Map<String, Long> parProduit = new HashMap<>();
        reclamationRepository.countByProduit().forEach(row -> parProduit.put(row[0].toString(), (Long) row[1]));

        long resolues = parStatut.getOrDefault(StatutReclamation.RESOLUE.name(), 0L);
        double tauxResolution = total > 0 ? (double) resolues / total * 100 : 0;

        return RapportSatisfactionDTO.builder()
                .noteMoyenne(noteMoyenne != null ? Math.round(noteMoyenne * 100.0) / 100.0 : 0.0)
                .totalReclamations(total)
                .reclamationsParStatut(parStatut)
                .reclamationsParProduit(parProduit)
                .reclamationsResolues(resolues)
                .tauxResolution(Math.round(tauxResolution * 100.0) / 100.0)
                .build();
    }
}
