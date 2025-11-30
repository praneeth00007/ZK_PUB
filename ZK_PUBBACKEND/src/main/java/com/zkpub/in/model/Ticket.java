package com.zkpub.in.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    
    @Id
    private String id;
    
    private String userId;
    private String eventId;
    private String ticketNumber;
    private Double amountPaid;
    private String paymentMethod; // "RAZORPAY" or "CRYPTO"
    private String paymentId;
    private String blockchainTxHash; // for crypto payments
    private String qrCode;
    private boolean isUsed = false;
    private LocalDateTime purchaseDate = LocalDateTime.now();
    private LocalDateTime usedDate;
    
    // Nested class for ticket holder info
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketHolder {
        private String name;
        private String email;
        private String phone;
    }
    
    private TicketHolder holder;
}