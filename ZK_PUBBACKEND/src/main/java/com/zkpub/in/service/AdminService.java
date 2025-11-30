package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;

public interface AdminService {
    ApiResponse<?> createAdmin(String requesterToken, User newAdmin);
    ApiResponse<?> getAllUsers(String requesterToken);
}


