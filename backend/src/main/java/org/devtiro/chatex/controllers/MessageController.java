package org.devtiro.chatex.controllers;

import java.security.Principal;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.ChatMessageRequest;
import org.devtiro.chatex.domain.dtos.responses.MessageDto;
import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.mappers.MessageMapper;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  private final MessageMapper messageMapper;

  @MessageMapping("/chat.send")
  public void handleChatMessage(@Payload ChatMessageRequest request, Principal userAuth) {

    UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) userAuth;
    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

    UUID senderId = userDetails.getId();

    Message message = messageService.saveMessage(senderId, request);

    MessageDto messageDto = messageMapper.toDto(message);
  }

}
