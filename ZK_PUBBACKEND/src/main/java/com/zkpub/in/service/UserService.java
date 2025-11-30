package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;

public interface UserService {
    ApiResponse<?> getUserProfile(String email);
    ApiResponse<?> updateUserProfile(String email, User userUpdateRequest);
    ApiResponse<?> getAllUsers();
}