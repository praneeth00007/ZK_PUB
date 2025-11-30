package com.zkpub.in.controller;

import com.zkpub.in.dto.ApiResponse;
import com.zkpub.in.model.IDDocument;
import com.zkpub.in.service.IDDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/id-documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IDDocumentController {
    
    private final IDDocumentService idDocumentService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<IDDocument>> uploadIDDocument(
            @RequestParam("userId") String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading ID document for user: {}", userId);
            
            IDDocument document = idDocumentService.uploadIDDocument(userId, file);
            
            return ResponseEntity.ok(ApiResponse.success(
                document, 
                "ID document uploaded successfully"
            ));
        } catch (Exception e) {
            log.error("Error uploading ID document: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to upload ID document: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/{documentId}/extract-text")
    public ResponseEntity<ApiResponse<String>> extractTextFromDocument(
            @PathVariable String documentId) {
        try {
            log.info("Extracting text from document: {}", documentId);
            
            String extractedText = idDocumentService.extractTextFromDocument(documentId);
            
            return ResponseEntity.ok(ApiResponse.success(
                extractedText, 
                "Text extracted successfully"
            ));
        } catch (Exception e) {
            log.error("Error extracting text: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to extract text: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/{documentId}/parse-birth-year")
    public ResponseEntity<ApiResponse<String>> parseBirthYearFromText(
            @PathVariable String documentId,
            @RequestBody String extractedText) {
        try {
            log.info("Parsing birth year from text for document: {}", documentId);
            
            String birthYear = idDocumentService.parseBirthYearFromText(documentId, extractedText);
            
            return ResponseEntity.ok(ApiResponse.success(
                birthYear, 
                "Birth year parsed successfully"
            ));
        } catch (Exception e) {
            log.error("Error parsing birth year: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to parse birth year: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/{documentId}/generate-zk-proof")
    public ResponseEntity<ApiResponse<IDDocument>> generateZKProof(
            @PathVariable String documentId) {
        try {
            log.info("Generating ZK proof for document: {}", documentId);
            
            IDDocument document = idDocumentService.generateZKProof(documentId);
            
            return ResponseEntity.ok(ApiResponse.success(
                document, 
                "ZK proof generated successfully"
            ));
        } catch (Exception e) {
            log.error("Error generating ZK proof: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to generate ZK proof: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/{documentId}/verify-blockchain")
    public ResponseEntity<ApiResponse<IDDocument>> verifyZKProofOnBlockchain(
            @PathVariable String documentId) {
        try {
            log.info("Verifying ZK proof on blockchain for document: {}", documentId);
            
            IDDocument document = idDocumentService.verifyZKProofOnBlockchain(documentId);
            
            return ResponseEntity.ok(ApiResponse.success(
                document, 
                "ZK proof verified on blockchain successfully"
            ));
        } catch (Exception e) {
            log.error("Error verifying ZK proof on blockchain: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to verify ZK proof on blockchain: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/{documentId}/complete-verification")
    public ResponseEntity<ApiResponse<IDDocument>> completeAgeVerification(
            @PathVariable String documentId) {
        try {
            log.info("Completing age verification for document: {}", documentId);
            
            IDDocument document = idDocumentService.completeAgeVerification(documentId);
            
            return ResponseEntity.ok(ApiResponse.success(
                document, 
                "Age verification completed successfully"
            ));
        } catch (Exception e) {
            log.error("Error completing age verification: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to complete age verification: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/{documentId}")
    public ResponseEntity<ApiResponse<IDDocument>> getDocumentById(
            @PathVariable String documentId) {
        try {
            Optional<IDDocument> document = idDocumentService.getDocumentById(documentId);
            
            if (document.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(
                    document.get(), 
                    "Document retrieved successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving document: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to retrieve document: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<IDDocument>> getDocumentByUserId(
            @PathVariable String userId) {
        try {
            Optional<IDDocument> document = idDocumentService.getDocumentByUserId(userId);
            
            if (document.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(
                    document.get(), 
                    "Document retrieved successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving document by user ID: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to retrieve document: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/verified")
    public ResponseEntity<ApiResponse<List<IDDocument>>> getAllVerifiedDocuments() {
        try {
            List<IDDocument> documents = idDocumentService.getAllVerifiedDocuments();
            
            return ResponseEntity.ok(ApiResponse.success(
                documents, 
                "Verified documents retrieved successfully"
            ));
        } catch (Exception e) {
            log.error("Error retrieving verified documents: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to retrieve verified documents: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/user/{userId}/verification-status")
    public ResponseEntity<ApiResponse<Boolean>> isUserAgeVerified(
            @PathVariable String userId) {
        try {
            boolean isVerified = idDocumentService.isUserAgeVerified(userId);
            
            return ResponseEntity.ok(ApiResponse.success(
                isVerified, 
                "Verification status retrieved successfully"
            ));
        } catch (Exception e) {
            log.error("Error checking verification status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to check verification status: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<IDDocumentService.VerificationStats>> getVerificationStats() {
        try {
            IDDocumentService.VerificationStats stats = idDocumentService.getVerificationStats();
            
            return ResponseEntity.ok(ApiResponse.success(
                stats, 
                "Verification statistics retrieved successfully"
            ));
        } catch (Exception e) {
            log.error("Error retrieving verification stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to retrieve verification statistics: " + e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteDocument(
            @PathVariable String documentId) {
        try {
            boolean deleted = idDocumentService.deleteDocument(documentId);
            
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success(
                    true, 
                    "Document deleted successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Failed to delete document"
                ));
            }
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(
                "Failed to delete document: " + e.getMessage()
            ));
        }
    }
}
