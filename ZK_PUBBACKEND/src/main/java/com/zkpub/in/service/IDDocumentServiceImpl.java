package com.zkpub.in.service;

import com.zkpub.in.model.IDDocument;
import com.zkpub.in.model.User;
import com.zkpub.in.repository.IDDocumentRepository;
import com.zkpub.in.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IDDocumentServiceImpl implements IDDocumentService {
    
    private final IDDocumentRepository idDocumentRepository;
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/id_documents/";
    
    @Override
    public IDDocument uploadIDDocument(String userId, MultipartFile file) throws Exception {
        log.info("Uploading ID document for user: {}", userId);
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (!isValidImageFile(file)) {
            throw new IllegalArgumentException("Invalid file type. Only images are allowed.");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath);
        
        // Generate document hash
        String documentHash = generateFileHash(filePath);
        
        // Check if document already exists
        Optional<IDDocument> existingDoc = idDocumentRepository.findByDocumentHash(documentHash);
        if (existingDoc.isPresent()) {
            // Delete the uploaded file since it's a duplicate
            Files.deleteIfExists(filePath);
            throw new IllegalArgumentException("This document has already been uploaded");
        }
        
        // Create ID document record
        IDDocument document = new IDDocument(
            userId,
            documentHash,
            originalFilename,
            file.getSize(),
            file.getContentType()
        );
        
        // Save to database
        IDDocument savedDocument = idDocumentRepository.save(document);
        
        log.info("ID document uploaded successfully: {}", savedDocument.getId());
        return savedDocument;
    }
    
    @Override
    public String extractTextFromDocument(String documentId) throws Exception {
        log.info("Extracting text from document: {}", documentId);
        
        IDDocument document = idDocumentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        // TODO: Implement actual OCR using API Ninjas or other service
        // For now, return mock extracted text
        String extractedText = "MOCK EXTRACTED TEXT - Birth Year: 1995";
        
        // Update document with extracted text
        document.setExtractedText(extractedText);
        document.setUpdatedAt(LocalDateTime.now());
        idDocumentRepository.save(document);
        
        log.info("Text extracted successfully from document: {}", documentId);
        return extractedText;
    }
    
    @Override
    public String parseBirthYearFromText(String documentId, String extractedText) throws Exception {
        log.info("Parsing birth year from text for document: {}", documentId);
        
        IDDocument document = idDocumentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        // TODO: Implement actual birth year parsing logic
        // For now, return mock birth year
        String birthYear = "1995";
        
        // Update document with parsed birth year
        document.setBirthYear(birthYear);
        document.setUpdatedAt(LocalDateTime.now());
        idDocumentRepository.save(document);
        
        log.info("Birth year parsed successfully: {} for document: {}", birthYear, documentId);
        return birthYear;
    }
    
    @Override
    public IDDocument generateZKProof(String documentId) throws Exception {
        log.info("Generating ZK proof for document: {}", documentId);
        
        IDDocument document = idDocumentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        if (document.getBirthYear() == null) {
            throw new IllegalStateException("Birth year must be parsed before generating ZK proof");
        }
        
        // TODO: Implement actual ZK proof generation
        // For now, create mock ZK proof data
        String zkProofData = "{\"proof\":\"mock_proof_data\",\"publicSignals\":[\"18\",\"2024\"]}";
        String zkProofHash = generateHash(zkProofData);
        
        // Update document with ZK proof
        document.setZkProofData(zkProofData);
        document.setZkProofHash(zkProofHash);
        document.setUpdatedAt(LocalDateTime.now());
        
        IDDocument savedDocument = idDocumentRepository.save(document);
        
        log.info("ZK proof generated successfully for document: {}", documentId);
        return savedDocument;
    }
    
    @Override
    public IDDocument verifyZKProofOnBlockchain(String documentId) throws Exception {
        log.info("Verifying ZK proof on blockchain for document: {}", documentId);
        
        IDDocument document = idDocumentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        if (document.getZkProofHash() == null) {
            throw new IllegalStateException("ZK proof must be generated before blockchain verification");
        }
        
        // TODO: Implement actual blockchain verification
        // For now, simulate successful verification
        String blockchainTxHash = "0x" + UUID.randomUUID().toString().replace("-", "");
        
        // Update document with blockchain verification
        document.setZkProofVerified(true);
        document.setBlockchainTxHash(blockchainTxHash);
        document.setUpdatedAt(LocalDateTime.now());
        
        IDDocument savedDocument = idDocumentRepository.save(document);
        
        log.info("ZK proof verified on blockchain successfully for document: {}", documentId);
        return savedDocument;
    }
    
    @Override
    public IDDocument completeAgeVerification(String documentId) throws Exception {
        log.info("Completing age verification for document: {}", documentId);
        
        IDDocument document = idDocumentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        if (!document.isZkProofVerified()) {
            throw new IllegalStateException("ZK proof must be verified on blockchain first");
        }
        
        // Calculate verified age
        int currentYear = LocalDateTime.now().getYear();
        int birthYear = Integer.parseInt(document.getBirthYear());
        int verifiedAge = currentYear - birthYear;
        
        // Update document with verification completion
        document.setIsAgeVerified(true);
        document.setVerifiedAge(verifiedAge);
        document.setVerificationDate(LocalDateTime.now());
        document.setUpdatedAt(LocalDateTime.now());
        
        // Update user verification status
        updateUserVerificationStatus(document.getUserId(), true, document.getZkProofHash());
        
        IDDocument savedDocument = idDocumentRepository.save(document);
        
        log.info("Age verification completed successfully for document: {}", documentId);
        return savedDocument;
    }
    
    @Override
    public Optional<IDDocument> getDocumentById(String documentId) {
        return idDocumentRepository.findById(documentId);
    }
    
    @Override
    public Optional<IDDocument> getDocumentByUserId(String userId) {
        return idDocumentRepository.findByUserId(userId);
    }
    
    @Override
    public Optional<IDDocument> getDocumentByHash(String documentHash) {
        return idDocumentRepository.findByDocumentHash(documentHash);
    }
    
    @Override
    public List<IDDocument> getAllVerifiedDocuments() {
        return idDocumentRepository.findByIsAgeVerifiedTrue();
    }
    
    @Override
    public boolean isUserAgeVerified(String userId) {
        return idDocumentRepository.existsByUserIdAndIsAgeVerifiedTrue(userId);
    }
    
    @Override
    public User updateUserVerificationStatus(String userId, boolean isVerified, String zkProofHash) {
        User user = userRepository.findByEmail(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setAgeVerified(isVerified);
        user.setZkProofHash(zkProofHash);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    @Override
    public boolean deleteDocument(String documentId) {
        try {
            idDocumentRepository.deleteById(documentId);
            return true;
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public VerificationStats getVerificationStats() {
        long total = idDocumentRepository.count();
        long verified = idDocumentRepository.countByIsAgeVerifiedTrue();
        long pending = total - verified;
        
        return new VerificationStats(total, verified, pending);
    }
    
    // Helper methods
    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    private String generateFileHash(Path filePath) throws IOException, NoSuchAlgorithmException {
        byte[] fileBytes = Files.readAllBytes(filePath);
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(fileBytes);
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    private String generateHash(String data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(data.getBytes());
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
