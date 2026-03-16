package org.devtiro.chatex.reps;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRep extends JpaRepository<Chat, UUID> {
  
  @Query("SELECT c FROM Chat c WHERE c.me.id = :userId OR c.chatUser.id = :userId ")
  Set<Chat> findAllChatsByUserId(@Param("userId") UUID userId);

}
