package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;
import com.zkpub.in.repository.UserRepository;
import com.zkpub.in.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private boolean isAdmin(String token) {
        if (!jwtUtil.validateToken(token)) return false;
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .map(u -> u.getRole() == User.Role.ADMIN)
                .orElse(false);
    }

    @Override
    public ApiResponse<?> createAdmin(String requesterToken, User newAdmin) {
        if (!isAdmin(requesterToken)) {
            return ApiResponse.error("Forbidden: Admin only");
        }
        if (userRepository.existsByEmail(newAdmin.getEmail())) {
            return ApiResponse.error("Email already exists");
        }
        newAdmin.setRole(User.Role.ADMIN);
        newAdmin.setPassword(passwordEncoder.encode(newAdmin.getPassword()));
        User saved = userRepository.save(newAdmin);
        return ApiResponse.success("Admin created", saved.getId());
    }

    @Override
    public ApiResponse<?> getAllUsers(String requesterToken) {
        if (!isAdmin(requesterToken)) {
            return ApiResponse.error("Forbidden: Admin only");
        }
        return ApiResponse.success("Users fetched", userRepository.findAll());
    }
}


