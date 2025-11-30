package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.dto.AuthRequest;

public interface AuthService {
    ApiResponse<?> register(AuthRequest.RegisterRequest request);
    ApiResponse<?> login(AuthRequest.LoginRequest request);
    ApiResponse<?> adminLogin(AuthRequest.LoginRequest request);
    ApiResponse<?> verifyZKProof(AuthRequest.ZKVerificationRequest request);
    boolean validateToken(String token);
    String extractEmailFromToken(String token);
}