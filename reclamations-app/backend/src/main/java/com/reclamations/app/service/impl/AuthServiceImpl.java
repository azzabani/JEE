package com.reclamations.app.service.impl;

import com.reclamations.app.dto.auth.AuthResponse;
import com.reclamations.app.dto.auth.LoginRequest;
import com.reclamations.app.dto.auth.RegisterRequest;
import com.reclamations.app.entity.Client;
import com.reclamations.app.entity.Utilisateur;
import com.reclamations.app.enums.Role;
import com.reclamations.app.repository.ClientRepository;
import com.reclamations.app.repository.UtilisateurRepository;
import com.reclamations.app.security.JwtService;
import com.reclamations.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
        }
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_CLIENT;

        Utilisateur user = Utilisateur.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nom(request.getNom())
                .email(request.getEmail())
                .role(role)
                .build();

        utilisateurRepository.save(Objects.requireNonNull(user));
        
        // Si c'est un CLIENT, créer automatiquement son profil client
        if (role == Role.ROLE_CLIENT) {
            try {
                // Vérifier si le client n'existe pas déjà
                if (!clientRepository.existsByEmail(user.getEmail())) {
                    Client client = Client.builder()
                            .nom(user.getNom())
                            .email(user.getEmail())
                            .telephone(request.getTelephone()) // Utiliser le téléphone fourni
                            .build();
                    clientRepository.save(Objects.requireNonNull(client));
                }
            } catch (Exception e) {
                // Si erreur, on continue quand même
                System.err.println("Erreur création profil client: " + e.getMessage());
            }
        }
        
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Utilisateur user = utilisateurRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
