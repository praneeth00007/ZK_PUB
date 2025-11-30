package com.zkpub.in.controller;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.User;
import com.zkpub.in.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createAdmin(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User newAdmin
    ) {
        String token = authHeader.substring(7);
        return ResponseEntity.ok(adminService.createAdmin(token, newAdmin));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        return ResponseEntity.ok(adminService.getAllUsers(token));
    }
}


