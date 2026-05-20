package com.reclamations.app.service.impl;

import com.reclamations.app.dto.ClientDTO;
import com.reclamations.app.entity.Client;
import com.reclamations.app.entity.Utilisateur;
import com.reclamations.app.exception.ResourceNotFoundException;
import com.reclamations.app.mapper.ClientMapper;
import com.reclamations.app.repository.ClientRepository;
import com.reclamations.app.repository.UtilisateurRepository;
import com.reclamations.app.service.ClientService;
import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public List<ClientDTO> findAll() {
        return clientRepository.findAll().stream().map(clientMapper::toDTO).toList();
    }

    @Override
    public ClientDTO findById(@NonNull Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + id));
    }

    @Override
    public ClientDTO findByEmail( String email) {
        return clientRepository.findByEmail(email)
                .map(clientMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'email: " + email));
    }

    @Override
    public ClientDTO create(ClientDTO dto) {
        if (clientRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe déjà");
        }
        Client client = clientMapper.toEntity(dto);
        return clientMapper.toDTO(clientRepository.save(Objects.requireNonNull(client)));
    }

    @Override
    public ClientDTO update( @NonNull Long id, ClientDTO dto) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + id));
        
        // Vérifier si l'email existe déjà pour un autre client
        if (!existing.getEmail().equals(dto.getEmail()) && clientRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe déjà");
        }
        
        existing.setNom(dto.getNom());
        existing.setEmail(dto.getEmail());
        existing.setTelephone(dto.getTelephone());
        return clientMapper.toDTO(clientRepository.save(existing));
    }

    @Override
    public void delete(@NonNull Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'id: " + id);
        }
        
        // Récupérer le client avant de le supprimer
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + id));
        
        // Supprimer l'utilisateur associé par email
        Optional<Utilisateur> utilisateur = utilisateurRepository.findByEmail(client.getEmail());
        if (utilisateur.isPresent()) {
            utilisateurRepository.delete(Objects.requireNonNull(utilisateur.get()));
        }
        
        // Supprimer le client
        clientRepository.deleteById(id);
    }
}
