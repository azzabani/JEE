package com.reclamations.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SuiviReclamationDTO {
    private Long id;

    @NotBlank(message = "Le message est obligatoire")
    private String message;

    @NotNull(message = "La réclamation est obligatoire")
    private Long reclamationId;

    @NotBlank(message = "L'employé est obligatoire")
    private String employe;

    @NotBlank(message = "L'action est obligatoire")
    private String action;

    private LocalDateTime date;
}
