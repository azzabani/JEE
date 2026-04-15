package com.reclamations.app.mapper;

import com.reclamations.app.dto.ReclamationDTO;
import com.reclamations.app.entity.Reclamation;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReclamationMapper {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "clientNom")
    @Mapping(source = "agentSAV.id", target = "agentId")
    @Mapping(source = "agentSAV.nom", target = "agentNom")
    ReclamationDTO toDTO(Reclamation reclamation);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "agentSAV", ignore = true)
    @Mapping(target = "suivis", ignore = true)
    Reclamation toEntity(ReclamationDTO dto);
}
