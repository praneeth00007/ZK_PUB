package com.zkpub.in.dto;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotBlank;

public class AuthRequest {
    
    public static class LoginRequest {
        @jakarta.validation.constraints.Email
        @jakarta.validation.constraints.NotBlank
        private String email;
        
        @jakarta.validation.constraints.NotBlank
        private String password;
        
        // Constructors
        public LoginRequest() {}
        
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }
        
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class RegisterRequest {
        @jakarta.validation.constraints.Email
        @jakarta.validation.constraints.NotBlank
        private String email;
        
        @jakarta.validation.constraints.NotBlank
        private String username;
        
        @jakarta.validation.constraints.NotBlank
        private String password;
        
        @jakarta.validation.constraints.NotBlank
        private String phone;
        
        private String zkProofHash;
        
        // Constructors
        public RegisterRequest() {}
        
        public RegisterRequest(String email, String username, String password, String phone, String zkProofHash) {
            this.email = email;
            this.username = username;
            this.password = password;
            this.phone = phone;
            this.zkProofHash = zkProofHash;
        }
        
        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getZkProofHash() { return zkProofHash; }
        public void setZkProofHash(String zkProofHash) { this.zkProofHash = zkProofHash; }
    }
    
    public static class ZKVerificationRequest {
        @jakarta.validation.constraints.NotBlank
        private String userId;
        
        @jakarta.validation.constraints.NotBlank
        private String proofHash;
        
        private Object proof; // ZK proof data
        
        // Constructors
        public ZKVerificationRequest() {}
        
        public ZKVerificationRequest(String userId, String proofHash, Object proof) {
            this.userId = userId;
            this.proofHash = proofHash;
            this.proof = proof;
        }
        
        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getProofHash() { return proofHash; }
        public void setProofHash(String proofHash) { this.proofHash = proofHash; }
        public Object getProof() { return proof; }
        public void setProof(Object proof) { this.proof = proof; }
    }
}