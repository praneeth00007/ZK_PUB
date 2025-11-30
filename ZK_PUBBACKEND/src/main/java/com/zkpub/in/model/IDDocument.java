package com.zkpub.in.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "id_documents")
public class IDDocument {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String userId; // Reference to User
    
    @Indexed(unique = true)
    private String documentHash; // Hash of the uploaded ID document
    
    private String extractedText; // Text extracted from the document
    private String birthYear; // Parsed birth year
    private String documentType; // "driver_license", "passport", etc.
    
    // ZK Proof related fields
    private String zkProofHash; // Hash of the generated ZK proof
    private String zkProofData; // JSON string of the ZK proof
    private boolean zkProofVerified; // Whether ZK proof is verified on blockchain
    private String blockchainTxHash; // Transaction hash of blockchain verification
    
    // Verification status
    private boolean isAgeVerified; // Whether age verification is complete
    private int verifiedAge; // The verified age (without revealing birth year)
    private LocalDateTime verificationDate; // When verification was completed
    
    // Metadata
    private String originalFileName; // Original name of uploaded file
    private long fileSize; // Size of uploaded file
    private String mimeType; // MIME type of the file
    private LocalDateTime uploadedAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Default constructor
    public IDDocument() {
    }
    
    // All args constructor
    public IDDocument(String id, String userId, String documentHash, String extractedText, String birthYear, 
                     String documentType, String zkProofHash, String zkProofData, boolean zkProofVerified, 
                     String blockchainTxHash, boolean isAgeVerified, int verifiedAge, LocalDateTime verificationDate, 
                     String originalFileName, long fileSize, String mimeType, LocalDateTime uploadedAt, 
                     LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.documentHash = documentHash;
        this.extractedText = extractedText;
        this.birthYear = birthYear;
        this.documentType = documentType;
        this.zkProofHash = zkProofHash;
        this.zkProofData = zkProofData;
        this.zkProofVerified = zkProofVerified;
        this.blockchainTxHash = blockchainTxHash;
        this.isAgeVerified = isAgeVerified;
        this.verifiedAge = verifiedAge;
        this.verificationDate = verificationDate;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.uploadedAt = uploadedAt;
        this.updatedAt = updatedAt;
    }
    
    // Constructor for new document upload
    public IDDocument(String userId, String documentHash, String originalFileName, 
                     long fileSize, String mimeType) {
        this.userId = userId;
        this.documentHash = documentHash;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.isAgeVerified = false;
        this.zkProofVerified = false;
        this.uploadedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Manual getters and setters for critical fields (in case Lombok doesn't work)
    public boolean getIsAgeVerified() {
        return isAgeVerified;
    }
    
    public void setIsAgeVerified(boolean isAgeVerified) {
        this.isAgeVerified = isAgeVerified;
    }
    
    public String getZkProofHash() {
        return zkProofHash;
    }
    
    public void setZkProofHash(String zkProofHash) {
        this.zkProofHash = zkProofHash;
    }
    
    public LocalDateTime getVerificationDate() {
        return verificationDate;
    }
    
    public void setVerificationDate(LocalDateTime verificationDate) {
        this.verificationDate = verificationDate;
    }
    
    public int getVerifiedAge() {
        return verifiedAge;
    }
    
    public void setVerifiedAge(int verifiedAge) {
        this.verifiedAge = verifiedAge;
    }
    
    public String getExtractedText() {
        return extractedText;
    }
    
    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }
    
    public String getBirthYear() {
        return birthYear;
    }
    
    public void setBirthYear(String birthYear) {
        this.birthYear = birthYear;
    }
    
    public String getDocumentHash() {
        return documentHash;
    }
    
    public void setDocumentHash(String documentHash) {
        this.documentHash = documentHash;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getOriginalFileName() {
        return originalFileName;
    }
    
    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }
    
    public long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getMimeType() {
        return mimeType;
    }
    
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Additional getters and setters for all fields
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }
    
    public String getZkProofData() {
        return zkProofData;
    }
    
    public void setZkProofData(String zkProofData) {
        this.zkProofData = zkProofData;
    }
    
    public boolean isZkProofVerified() {
        return zkProofVerified;
    }
    
    public void setZkProofVerified(boolean zkProofVerified) {
        this.zkProofVerified = zkProofVerified;
    }
    
    public String getBlockchainTxHash() {
        return blockchainTxHash;
    }
    
    public void setBlockchainTxHash(String blockchainTxHash) {
        this.blockchainTxHash = blockchainTxHash;
    }
}
