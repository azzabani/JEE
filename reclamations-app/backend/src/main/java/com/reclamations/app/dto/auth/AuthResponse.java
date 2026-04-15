package com.reclamations.app.dto.auth;

import com.reclamations.app.enums.Role;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String username;
    private String nom;
    private String email;
    private Role role;
}
