package com.zkpub.in.controller;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;
import com.zkpub.in.service.AuthService;
import com.zkpub.in.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        
        if (!authService.validateToken(token)) {
            return ResponseEntity.ok(ApiResponse.error("Invalid token"));
        }

        String email = authService.extractEmailFromToken(token);
        ApiResponse<?> response = userService.getUserProfile(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<?>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User userUpdateRequest) {
        
        String token = authHeader.substring(7);
        
        if (!authService.validateToken(token)) {
            return ResponseEntity.ok(ApiResponse.error("Invalid token"));
        }

        String email = authService.extractEmailFromToken(token);
        ApiResponse<?> response = userService.updateUserProfile(email, userUpdateRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        ApiResponse<?> response = userService.getAllUsers();
        return ResponseEntity.ok(response);
    }
}