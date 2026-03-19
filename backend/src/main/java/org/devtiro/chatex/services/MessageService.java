package org.devtiro.chatex.services;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.ChatMessageRequest;
import org.devtiro.chatex.domain.entities.Message;

public interface MessageService {

  Message saveMessage(UUID senderId, ChatMessageRequest request);

}
