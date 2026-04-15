package com.reclamations.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "agents_sav")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AgentSAV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String competence;

    @OneToMany(mappedBy = "agentSAV", fetch = FetchType.LAZY)
    private List<Reclamation> reclamations;
}
