package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.dto.AuthRequest;
import com.zkpub.in.model.User;
import com.zkpub.in.model.ZKProof;
import com.zkpub.in.repository.UserRepository;
import com.zkpub.in.repository.ZKProofRepository;
import com.zkpub.in.service.AuthService;
import com.zkpub.in.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ZKProofRepository zkProofRepository;
    private final JwtUtil jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ApiResponse<?> register(AuthRequest.RegisterRequest request) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already exists");
            }
            
            if (userRepository.existsByUsername(request.getUsername())) {
                return ApiResponse.error("Username already exists");
            }

            // Create new user
            User user = new User(
                request.getEmail(),
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone()
            );

            // If ZK proof provided, mark as age verified
            if (request.getZkProofHash() != null && !request.getZkProofHash().isEmpty()) {
                user.setAgeVerified(true);
                user.setZkProofHash(request.getZkProofHash());
            }

            User savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("userId", savedUser.getId());
            response.put("email", savedUser.getEmail());
            response.put("username", savedUser.getUsername());
            response.put("isAgeVerified", savedUser.isAgeVerified());

            return ApiResponse.success("User registered successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Registration failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> login(AuthRequest.LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ApiResponse.error("Invalid credentials");
            }

            // Generate JWT token
            String token = jwtUtils.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());
            response.put("isAgeVerified", user.isAgeVerified());

            return ApiResponse.success("Login successful", response);

        } catch (Exception e) {
            return ApiResponse.error("Login failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> adminLogin(AuthRequest.LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }
            User user = userOpt.get();
            if (user.getRole() != User.Role.ADMIN) {
                return ApiResponse.error("Not an admin");
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ApiResponse.error("Invalid credentials");
            }
            String token = jwtUtils.generateToken(user.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());
            response.put("role", user.getRole().name());
            return ApiResponse.success("Admin login successful", response);
        } catch (Exception e) {
            return ApiResponse.error("Login failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> verifyZKProof(AuthRequest.ZKVerificationRequest request) {
        try {
            Optional<User> userOpt = userRepository.findById(request.getUserId());
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            // Mock ZK verification (replace with actual ZK verification logic)
            boolean isValidProof = mockZKVerification(request.getProof());

            if (!isValidProof) {
                return ApiResponse.error("Invalid ZK proof");
            }

            // Save ZK proof
            ZKProof zkProof = new ZKProof();
            zkProof.setUserId(request.getUserId());
            zkProof.setProofHash(request.getProofHash());
            zkProof.setProof((Map<String, Object>) request.getProof());
            zkProof.setVerified(true);
            zkProof.setVerifiedAt(LocalDateTime.now());

            zkProofRepository.save(zkProof);

            // Update user
            User user = userOpt.get();
            user.setAgeVerified(true);
            user.setZkProofHash(request.getProofHash());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return ApiResponse.success("ZK proof verified successfully", null);

        } catch (Exception e) {
            return ApiResponse.error("ZK verification failed: " + e.getMessage());
        }
    }

    private boolean mockZKVerification(Object proof) {
        // Mock verification - always return true for testing
        // In real implementation, verify the ZK proof here
        return proof != null;
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtils.validateToken(token);
    }

    @Override
    public String extractEmailFromToken(String token) {
        return jwtUtils.extractEmail(token);
    }
}