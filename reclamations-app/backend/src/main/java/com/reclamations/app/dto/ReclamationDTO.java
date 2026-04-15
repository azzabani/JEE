package com.reclamations.app.dto;

import com.reclamations.app.enums.StatutReclamation;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReclamationDTO {
    private Long id;

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

    private String clientNom;

    @NotBlank(message = "Le produit est obligatoire")
    private String produit;

    private StatutReclamation statut;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, max = 1000, message = "La description doit contenir entre 10 et 1000 caractères")
    private String description;

    private LocalDateTime date;

    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer note;

    private Long agentId;
    private String agentNom;
}
