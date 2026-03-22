package org.devtiro.chatex.services;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;

public interface ChatService {

  Set<Chat> getChats(UUID userId);

  Set<Chat> getSilencedChats(UUID userId);

  Chat getChat(UUID chatId);

  Chat createChat(String username, UUID userId);

  void deleteChat(UUID chatId);
}
