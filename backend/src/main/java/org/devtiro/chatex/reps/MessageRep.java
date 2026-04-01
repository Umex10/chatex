package org.devtiro.chatex.reps;

import java.util.UUID;

import org.devtiro.chatex.domain.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * Data Access Object (Repository) for Message entities.
 * Manages persistence and retrieval operations for individual chat messages.
 */
public interface MessageRep extends JpaRepository<Message, UUID> {

@Modifying
@Transactional
@Query("UPDATE Message m SET m.seen = true WHERE m.chat.id = :chatId AND m.receiver.id = :userId AND m.seen = false")
void markAllMessagesAsSeen(@Param("chatId") UUID chatId, @Param("userId") UUID userId);

}
