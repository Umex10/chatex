package org.devtiro.chatex.services.ipl;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Chat;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.ChatRep;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ChatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceIpl implements ChatService {

  private final UserRep userRep;
  private final ChatRep chatRep;

    /**
     * {@inheritDoc}
     *
     * Throws EntityNotFoundException if user is not found.
     */
    @Override
    public Set<Chat> getChats(UUID userId) {
        userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        return chatRep.findAllChatsByUserId(userId);
    }

    /**
     * {@inheritDoc}
     *
     * Throws EntityNotFoundException if user is not found.
     */
    @Override
    public Set<Chat> getSilencedChats(UUID userId) {
        userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        return chatRep.findAllChatsByUserIdWithSilencedUser(userId);
    }

    /**
     * {@inheritDoc}
     *
     * Throws EntityNotFoundException if chat is not found.
     */
    @Override
    public Chat getChat(UUID chatId) {
        return chatRep.findChatWithMessages(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with id " + chatId + " not found"));
    }

    /**
     * {@inheritDoc}
     *
     * Throws EntityNotFoundException if user or chat partner is not found.
     */
    @Override
    @Transactional
    public Chat createChat(String username, UUID userId) {

        User chatUser = userRep.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User with username " + username + " not found"));

        User me = userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        Optional<Chat> alreadyHasChat = chatRep.findChatBetweenUsers(chatUser.getId(), me.getId());

        if (!alreadyHasChat.isEmpty())
            return alreadyHasChat.get();

        Chat chat = Chat.builder()
                .chatUser(chatUser)
                .me(me)
                .build();

        return chatRep.saveAndFlush(chat);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteChat(UUID chatId) {
        chatRep.deleteById(chatId);
    }

}
