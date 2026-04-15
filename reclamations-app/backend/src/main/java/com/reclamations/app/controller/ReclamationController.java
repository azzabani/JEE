package com.reclamations.app.controller;

import com.reclamations.app.dto.RapportSatisfactionDTO;
import com.reclamations.app.dto.ReclamationDTO;
import com.reclamations.app.enums.StatutReclamation;
import com.reclamations.app.service.ReclamationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
@Tag(name = "Réclamations", description = "Gestion des réclamations clients")
public class ReclamationController {

    private final ReclamationService reclamationService;

    @GetMapping
    @Operation(summary = "Lister toutes les réclamations")
    public ResponseEntity<List<ReclamationDTO>> findAll() {
        return ResponseEntity.ok(reclamationService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une réclamation par ID")
    public ResponseEntity<ReclamationDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.findById(id));
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Réclamations d'un client")
    public ResponseEntity<List<ReclamationDTO>> findByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(reclamationService.findByClient(clientId));
    }

    @GetMapping("/agent/{agentId}")
    @Operation(summary = "Réclamations d'un agent")
    public ResponseEntity<List<ReclamationDTO>> findByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(reclamationService.findByAgent(agentId));
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Réclamations par statut")
    public ResponseEntity<List<ReclamationDTO>> findByStatut(@PathVariable StatutReclamation statut) {
        return ResponseEntity.ok(reclamationService.findByStatut(statut));
    }

    @PostMapping
    @Operation(summary = "Créer une réclamation")
    public ResponseEntity<ReclamationDTO> create(@Valid @RequestBody ReclamationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une réclamation")
    public ResponseEntity<ReclamationDTO> update(@PathVariable Long id, @Valid @RequestBody ReclamationDTO dto) {
        return ResponseEntity.ok(reclamationService.update(id, dto));
    }

    @PatchMapping("/{id}/affecter/{agentId}")
    @Operation(summary = "Affecter une réclamation à un agent SAV")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_AGENT')")
    public ResponseEntity<ReclamationDTO> affecter(@PathVariable Long id, @PathVariable Long agentId) {
        return ResponseEntity.ok(reclamationService.affecter(id, agentId));
    }

    @PatchMapping("/{id}/statut/{statut}")
    @Operation(summary = "Changer le statut d'une réclamation")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_AGENT')")
    public ResponseEntity<ReclamationDTO> changerStatut(@PathVariable Long id, @PathVariable StatutReclamation statut) {
        return ResponseEntity.ok(reclamationService.changerStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une réclamation")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reclamationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rapport")
    @Operation(summary = "Générer le rapport de satisfaction client")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_AGENT')")
    public ResponseEntity<RapportSatisfactionDTO> rapport() {
        return ResponseEntity.ok(reclamationService.genererRapport());
    }
}
