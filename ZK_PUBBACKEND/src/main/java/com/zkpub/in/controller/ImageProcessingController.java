package com.zkpub.in.controller;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.service.ImageProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/image")
@CrossOrigin(origins = "*")
public class ImageProcessingController {

    private final ImageProcessingService imageProcessingService;
    
    // Constructor injection
    public ImageProcessingController(ImageProcessingService imageProcessingService) {
        this.imageProcessingService = imageProcessingService;
    }

    @PostMapping("/process-id")
    public ResponseEntity<ApiResponse<?>> processIdDocument(
            @RequestParam("image") MultipartFile image,
            @RequestParam("email") String email) {
        try {
            ApiResponse<?> response = imageProcessingService.processIdDocument(image, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Image processing failed: " + e.getMessage()));
        }
    }

    @PostMapping("/generate-zk-proof")
    public ResponseEntity<ApiResponse<?>> generateZKProof(
            @RequestParam("image") MultipartFile image,
            @RequestParam("email") String email) {
        try {
            ApiResponse<?> response = imageProcessingService.generateZKProof(image, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ZK proof generation failed: " + e.getMessage()));
        }
    }

    @GetMapping("/verify-age/{email}")
    public ResponseEntity<ApiResponse<?>> verifyAge(@PathVariable String email) {
        try {
            ApiResponse<?> response = imageProcessingService.verifyAge(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Age verification failed: " + e.getMessage()));
        }
    }
}
