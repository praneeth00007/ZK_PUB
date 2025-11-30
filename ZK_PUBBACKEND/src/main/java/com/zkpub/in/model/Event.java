package com.zkpub.in.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private Double ticketPrice;
    private Integer totalTickets;
    private Integer availableTickets;
    private String imageUrl;
    private List<String> categories;
    private boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}