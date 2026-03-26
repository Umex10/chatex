package org.devtiro.chatex.services;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.ChatMessageRequest;
import org.devtiro.chatex.domain.entities.Message;

/**
 * Service interface for message operations.
 * Provides methods for saving chat messages.
 */
public interface MessageService {

    /**
     * Saves a new message sent by a user.
     *
     * @param senderId the ID of the sender
     * @param request the message request payload
     * @return the saved Message entity
     */
    Message saveMessage(UUID senderId, ChatMessageRequest request);

}
