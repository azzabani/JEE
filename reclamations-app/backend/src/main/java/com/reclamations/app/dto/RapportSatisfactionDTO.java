package com.reclamations.app.dto;

import lombok.*;

import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RapportSatisfactionDTO {
    private Double noteMoyenne;
    private Long totalReclamations;
    private Map<String, Long> reclamationsParStatut;
    private Map<String, Long> reclamationsParProduit;
    private Long reclamationsResolues;
    private Double tauxResolution;
}
