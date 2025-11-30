package com.zkpub.in.service;

import com.zkpub.in.dto.ApiResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageProcessingService {
    ApiResponse<?> processIdDocument(MultipartFile image, String email);
    ApiResponse<?> generateZKProof(MultipartFile image, String email);
    ApiResponse<?> verifyAge(String email);
}
