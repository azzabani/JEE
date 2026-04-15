package com.reclamations.app.mapper;

import com.reclamations.app.dto.AgentSAVDTO;
import com.reclamations.app.entity.AgentSAV;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AgentSAVMapper {
    AgentSAVDTO toDTO(AgentSAV agent);
    @Mapping(target = "reclamations", ignore = true)
    AgentSAV toEntity(AgentSAVDTO dto);
}
