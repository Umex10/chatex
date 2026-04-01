package org.devtiro.chatex.controllers;

import java.security.Principal;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.ChatMessageRequest;
import org.devtiro.chatex.domain.dtos.responses.MessageDto;
import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.mappers.MessageMapper;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.ChatService;
import org.devtiro.chatex.services.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

/**
 * WebSocket controller for handling real-time chat messages.
 * Manages the reception, persistence, and broadcasting of messages
 * using Spring WebSockets and STOMP messaging.
 */
@Controller
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  private final MessageMapper messageMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final ChatService chatService;
  
  /**
   * Processes incoming real-time chat messages from users.
   * Persists the message and broadcasts it back to both the sender
   * and the receiving user via private message queues.
   *
   * @param request  the payload containing message content and target receiver
   * @param userAuth the authentication principal injected by the WebSocket session
   */
  @MessageMapping("/chat.send")
  public void handleChatMessage(@Payload ChatMessageRequest request, Principal userAuth) {

    UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) userAuth;
    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

    UUID senderId = userDetails.getId();

    Message message = messageService.saveMessage(senderId, request);

    chatService.markAllMessagesAsSeen(message.getChat().getId(), senderId);

    MessageDto messageDto = messageMapper.toDto(message);

    // Send the message to the receiver's private queue
    messagingTemplate.convertAndSendToUser(
        request.getReceiverUsername(), 
        "/queue/messages", 
        messageDto
    );

    // Send confirmation to the sender, that the message was sent
    messagingTemplate.convertAndSendToUser(
        userDetails.getUsername(), 
        "/queue/messages", 
        messageDto
    );
  }

}
