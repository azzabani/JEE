package com.reclamations.app.service;

import com.reclamations.app.dto.auth.AuthResponse;
import com.reclamations.app.dto.auth.LoginRequest;
import com.reclamations.app.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
