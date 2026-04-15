package com.reclamations.app.service;

import com.reclamations.app.dto.ClientDTO;
import java.util.List;

public interface ClientService {
    List<ClientDTO> findAll();
    ClientDTO findById(Long id);
    ClientDTO findByEmail(String email);
    ClientDTO create(ClientDTO dto);
    ClientDTO update(Long id, ClientDTO dto);
    void delete(Long id);
}
