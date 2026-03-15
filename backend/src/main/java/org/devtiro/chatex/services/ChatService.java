package org.devtiro.chatex.services;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;

public interface ChatService {


  Set<Chat> getChats(UUID userId);

}
