package org.devtiro.chatex.services;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;

/**
 * Service interface for chat management operations.
 * Provides methods for creating, retrieving, and deleting chats.
 */
public interface ChatService {

    /**
     * Retrieves all chats for a given user.
     *
     * @param userId the ID of the user
     * @return a set of Chat entities
     */
    Set<Chat> getChats(UUID userId);

    /**
     * Retrieves all silenced chats for a given user.
     *
     * @param userId the ID of the user
     * @return a set of silenced Chat entities
     */
    Set<Chat> getSilencedChats(UUID userId);

    /**
     * Retrieves a chat by its unique identifier.
     *
     * @param chatId the ID of the chat
     * @return the Chat entity
     */
    Chat getChat(UUID chatId, UUID userId);

    /**
     * Creates a new chat for a user with the specified username.
     *
     * @param username the username to chat with
     * @param userId   the ID of the user creating the chat
     * @return the created Chat entity
     */
    Chat createChat(String username, UUID userId);

    /**
     * Deletes a chat by its unique identifier.
     *
     * @param chatId the ID of the chat to delete
     */
    void deleteChat(UUID chatId);

    void markAllMessagesAsSeen(UUID chatId, UUID userId);
}
