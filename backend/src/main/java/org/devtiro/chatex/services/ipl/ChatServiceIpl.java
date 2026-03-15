package org.devtiro.chatex.services.ipl;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ChatService;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceIpl implements ChatService {

  private final UserRep userRep;

  @Override
  public Set<Chat> getChats(UUID userId) {
    User user = userRep.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

    return user.getChats();

  }

}
