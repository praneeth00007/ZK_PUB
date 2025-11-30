package com.zkpub.in.service;

import com.zkpub.in.model.IDDocument;
import com.zkpub.in.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IDDocumentService {
    
    // Upload and process ID document
    IDDocument uploadIDDocument(String userId, MultipartFile file) throws Exception;
    
    // Extract text from uploaded document
    String extractTextFromDocument(String documentId) throws Exception;
    
    // Parse birth year from extracted text
    String parseBirthYearFromText(String documentId, String extractedText) throws Exception;
    
    // Generate ZK proof for age verification
    IDDocument generateZKProof(String documentId) throws Exception;
    
    // Verify ZK proof on blockchain
    IDDocument verifyZKProofOnBlockchain(String documentId) throws Exception;
    
    // Complete age verification process
    IDDocument completeAgeVerification(String documentId) throws Exception;
    
    // Get document by ID
    Optional<IDDocument> getDocumentById(String documentId);
    
    // Get document by user ID
    Optional<IDDocument> getDocumentByUserId(String userId);
    
    // Get document by document hash
    Optional<IDDocument> getDocumentByHash(String documentHash);
    
    // Get all verified documents
    List<IDDocument> getAllVerifiedDocuments();
    
    // Check if user is age verified
    boolean isUserAgeVerified(String userId);
    
    // Update user verification status
    User updateUserVerificationStatus(String userId, boolean isVerified, String zkProofHash);
    
    // Delete document (admin only)
    boolean deleteDocument(String documentId);
    
    // Get verification statistics
    VerificationStats getVerificationStats();
    
    // Data class for statistics
    class VerificationStats {
        public long totalDocuments;
        public long verifiedDocuments;
        public long pendingVerification;
        public double verificationRate;
        
        public VerificationStats(long total, long verified, long pending) {
            this.totalDocuments = total;
            this.verifiedDocuments = verified;
            this.pendingVerification = pending;
            this.verificationRate = total > 0 ? (double) verified / total * 100 : 0;
        }
    }
}
