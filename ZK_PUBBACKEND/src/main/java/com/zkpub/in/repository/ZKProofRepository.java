package com.zkpub.in.repository;

import com.zkpub.in.*;
import com.zkpub.in.model.ZKProof;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZKProofRepository extends MongoRepository<ZKProof, String> {
    Optional<ZKProof> findByUserId(String userId);
    Optional<ZKProof> findByProofHash(String proofHash);
}