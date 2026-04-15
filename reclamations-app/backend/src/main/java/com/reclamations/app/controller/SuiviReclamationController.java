package com.reclamations.app.controller;

import com.reclamations.app.dto.SuiviReclamationDTO;
import com.reclamations.app.service.SuiviReclamationService;
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
@RequestMapping("/api/suivis")
@RequiredArgsConstructor
@Tag(name = "Suivi Réclamations", description = "Suivi et historique des réclamations")
public class SuiviReclamationController {

    private final SuiviReclamationService suiviService;

    @GetMapping("/reclamation/{reclamationId}")
    @Operation(summary = "Obtenir le suivi d'une réclamation")
    public ResponseEntity<List<SuiviReclamationDTO>> findByReclamation(@PathVariable Long reclamationId) {
        return ResponseEntity.ok(suiviService.findByReclamation(reclamationId));
    }

    @PostMapping
    @Operation(summary = "Ajouter un suivi à une réclamation")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_AGENT')")
    public ResponseEntity<SuiviReclamationDTO> create(@Valid @RequestBody SuiviReclamationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(suiviService.create(dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un suivi")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        suiviService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
