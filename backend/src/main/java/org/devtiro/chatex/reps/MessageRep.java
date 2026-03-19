package org.devtiro.chatex.reps;

import java.util.UUID;

import org.devtiro.chatex.domain.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRep extends JpaRepository<Message, UUID> {
  
}
