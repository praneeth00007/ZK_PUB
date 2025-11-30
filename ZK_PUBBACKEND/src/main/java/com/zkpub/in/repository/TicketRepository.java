package com.zkpub.in.repository;

import com.zkpub.in.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByEventId(String eventId);
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    Optional<Ticket> findByQrCode(String qrCode);
    List<Ticket> findByUserIdAndEventId(String userId, String eventId);
}