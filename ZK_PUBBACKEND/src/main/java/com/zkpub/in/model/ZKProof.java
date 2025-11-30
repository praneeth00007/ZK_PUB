package com.zkpub.in.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "zk_proofs")
public class ZKProof {
    
    @Id
    private String id;
    
    private String userId;
    private String proofHash;
    private Map<String, Object> proof; // The actual ZK proof data
    private boolean isVerified = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime verifiedAt;
}