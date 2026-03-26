package org.devtiro.chatex.services.ipl;

import java.time.LocalDate;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.ChatMessageRequest;
import org.devtiro.chatex.domain.entities.Chat;
import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.ChatRep;
import org.devtiro.chatex.reps.MessageRep;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceIpl implements MessageService {

  private final UserRep userRep;
  private final ChatRep chatRep;
  private final MessageRep messageRep;

    /**
     * {@inheritDoc}
     *
     * Finds sender and receiver, validates chat, and persists the message.
     * Throws EntityNotFoundException if sender, receiver, or chat is not found.
     */
    @Override
    @Transactional
    public Message saveMessage(UUID senderId, ChatMessageRequest request) {

      User sender = userRep.findById(senderId)
          .orElseThrow(() -> new EntityNotFoundException("Sender with id " + senderId + " not found"));

      String receiverUsername = request.getReceiverUsername();
      UUID chatId = request.getChatId();
      String text = request.getText();

      User receiver = userRep.findByUsername(receiverUsername)
          .orElseThrow(() -> new EntityNotFoundException("Receiver with username " + receiverUsername + " not found"));

      Chat chat = chatRep.findById(chatId)
          .orElseThrow(() -> new EntityNotFoundException("Chat with id " + chatId + " not found"));

      Message message = Message.builder()
          .text(text)
          .sender(sender)
          .receiver(receiver)
          .createdAt(LocalDate.now())
          .chat(chat)
          .build();

      return messageRep.save(message);
    }

}
