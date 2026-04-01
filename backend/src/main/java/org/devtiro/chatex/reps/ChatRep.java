package org.devtiro.chatex.reps;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Data Access Object (Repository) for Chat entities.
 * Provides custom queries to fetch chats based on user relationships and silenced status.
 */
@Repository
public interface ChatRep extends JpaRepository<Chat, UUID> {

        // @Query("SELECT c FROM Chat c WHERE c.me.id = :userId OR c.chatUser.id =
        // :userId ")
        // Set<Chat> findAllChatsByUserId(@Param("userId") UUID userId);

        @Query("SELECT c FROM Chat c WHERE " +
                        "(c.me.id = :userId OR c.chatUser.id = :userId) " +
                        "AND NOT EXISTS (" +
                        "  SELECT 1 FROM User u " +
                        "  WHERE (u.id = :userId AND (c.chatUser MEMBER OF u.silencedUsers OR c.me MEMBER OF u.silencedUsers))"
                        +
                        ")")
        Set<Chat> findAllChatsByUserId(@Param("userId") UUID userId);

        @Query("SELECT c FROM Chat c WHERE " +
                        "(c.me.id = :userId OR c.chatUser.id = :userId) " +
                        "AND EXISTS (" +
                        "  SELECT 1 FROM User u " +
                        "  WHERE (u.id = :userId AND (c.chatUser MEMBER OF u.silencedUsers OR c.me MEMBER OF u.silencedUsers))"
                        +
                        ")")
        Set<Chat> findAllChatsByUserIdWithSilencedUser(@Param("userId") UUID userId);

        @Query("SELECT c FROM Chat c WHERE " +
                        "(c.me.id = :userA AND c.chatUser.id = :userB) OR " +
                        "(c.me.id = :userB AND c.chatUser.id = :userA)")
        Optional<Chat> findChatBetweenUsers(@Param("userA") UUID userA, @Param("userB") UUID userB);

        @Query("SELECT c FROM Chat c " +
                        "LEFT JOIN FETCH c.messages " +
                        "WHERE c.id = :chatId ")
        Optional<Chat> findChatWithMessages(@Param("chatId") UUID chatId);

}
