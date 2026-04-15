package com.reclamations.app.mapper;

import com.reclamations.app.dto.SuiviReclamationDTO;
import com.reclamations.app.entity.SuiviReclamation;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SuiviReclamationMapper {

    @Mapping(source = "reclamation.id", target = "reclamationId")
    SuiviReclamationDTO toDTO(SuiviReclamation suivi);

    @Mapping(target = "reclamation", ignore = true)
    SuiviReclamation toEntity(SuiviReclamationDTO dto);
}
