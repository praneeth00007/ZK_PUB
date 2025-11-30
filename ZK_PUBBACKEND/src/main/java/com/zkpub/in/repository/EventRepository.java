package com.zkpub.in.repository;

import com.zkpub.in.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByIsActiveTrue();
    List<Event> findByEventDateAfter(LocalDateTime date);
    
    @Query("{'categories': ?0, 'isActive': true}")
    List<Event> findByCategory(String category);
    
    @Query("{'title': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    List<Event> findByTitleContainingIgnoreCase(String title);
}