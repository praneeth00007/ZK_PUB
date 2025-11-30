package com.zkpub.in.controller;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.dto.AuthRequest;
import com.zkpub.in.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody AuthRequest.RegisterRequest request) {
        ApiResponse<?> response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody AuthRequest.LoginRequest request) {
        ApiResponse<?> response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<?>> adminLogin(@Valid @RequestBody AuthRequest.LoginRequest request) {
        ApiResponse<?> response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-zk")
    public ResponseEntity<ApiResponse<?>> verifyZKProof(@Valid @RequestBody AuthRequest.ZKVerificationRequest request) {
        ApiResponse<?> response = authService.verifyZKProof(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(ApiResponse.success("Auth API is working!", "Hello from ZK Pub Backend"));
    }
}