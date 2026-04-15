package com.reclamations.app.mapper;

import com.reclamations.app.dto.ClientDTO;
import com.reclamations.app.entity.Client;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toDTO(Client client);
    @Mapping(target = "reclamations", ignore = true)
    Client toEntity(ClientDTO dto);
}
