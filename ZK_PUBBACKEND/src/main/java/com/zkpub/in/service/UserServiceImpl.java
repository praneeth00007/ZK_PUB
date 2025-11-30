package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;
import com.zkpub.in.repository.UserRepository;
import com.zkpub.in.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public ApiResponse<?> getUserProfile(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            User user = userOpt.get();
            
            // Don't return password
            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("id", user.getId());
            userProfile.put("email", user.getEmail());
            userProfile.put("username", user.getUsername());
            userProfile.put("phone", user.getPhone());
            userProfile.put("isAgeVerified", user.isAgeVerified());
            userProfile.put("createdAt", user.getCreatedAt());

            return ApiResponse.success("User profile retrieved", userProfile);

        } catch (Exception e) {
            return ApiResponse.error("Failed to get user profile: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> updateUserProfile(String email, User userUpdateRequest) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            User user = userOpt.get();
            
            // Update allowed fields
            if (userUpdateRequest.getUsername() != null) {
                user.setUsername(userUpdateRequest.getUsername());
            }
            if (userUpdateRequest.getPhone() != null) {
                user.setPhone(userUpdateRequest.getPhone());
            }
            
            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userRepository.save(user);

            return ApiResponse.success("Profile updated successfully", updatedUser.getId());

        } catch (Exception e) {
            return ApiResponse.error("Failed to update profile: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ApiResponse.success("Users retrieved successfully", users);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get users: " + e.getMessage());
        }
    }
}