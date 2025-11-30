package com.zkpub.in.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    public enum Role { USER, ADMIN }
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String username;
    private String password;
    private String phone;
    private boolean isAgeVerified;
    private String zkProofHash;
    private List<String> ticketIds;
    private Role role = Role.USER;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public User(String email, String username, String password, String phone) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.isAgeVerified = false;
        this.role = Role.USER;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}