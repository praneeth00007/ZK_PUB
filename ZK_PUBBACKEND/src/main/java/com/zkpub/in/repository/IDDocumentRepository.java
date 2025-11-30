package com.zkpub.in.repository;

import com.zkpub.in.model.IDDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDDocumentRepository extends MongoRepository<IDDocument, String> {
    
    // Find by user ID
    Optional<IDDocument> findByUserId(String userId);
    
    // Find by document hash
    Optional<IDDocument> findByDocumentHash(String documentHash);
    
    // Find by ZK proof hash
    Optional<IDDocument> findByZkProofHash(String zkProofHash);
    
    // Find all verified documents
    List<IDDocument> findByIsAgeVerifiedTrue();
    
    // Find all documents with verified ZK proofs
    List<IDDocument> findByZkProofVerifiedTrue();
    
    // Find by blockchain transaction hash
    Optional<IDDocument> findByBlockchainTxHash(String blockchainTxHash);
    
    // Check if user has verified age
    boolean existsByUserIdAndIsAgeVerifiedTrue(String userId);
    
    // Count verified documents
    long countByIsAgeVerifiedTrue();
}
