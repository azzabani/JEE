package com.reclamations.app.controller;

import com.reclamations.app.dto.AgentSAVDTO;
import com.reclamations.app.service.AgentSAVService;
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
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@Tag(name = "Agents SAV", description = "Gestion des agents du service après-vente")
public class AgentSAVController {

    private final AgentSAVService agentSAVService;

    @GetMapping
    @Operation(summary = "Lister tous les agents SAV")
    public ResponseEntity<List<AgentSAVDTO>> findAll() {
        return ResponseEntity.ok(agentSAVService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un agent par ID")
    public ResponseEntity<AgentSAVDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(agentSAVService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un agent SAV")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AgentSAVDTO> create(@Valid @RequestBody AgentSAVDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentSAVService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un agent SAV")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AgentSAVDTO> update(@PathVariable Long id, @Valid @RequestBody AgentSAVDTO dto) {
        return ResponseEntity.ok(agentSAVService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un agent SAV")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agentSAVService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
