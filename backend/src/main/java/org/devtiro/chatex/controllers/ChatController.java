package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.responses.ChatDto;
import org.devtiro.chatex.domain.entities.Chat;
import org.devtiro.chatex.domain.mappers.ChatMapper;
import org.devtiro.chatex.services.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

  private final ChatService chatService;
  private final ChatMapper chatMapper;


  @GetMapping
  public ResponseEntity<List<ChatDto>> getChats(@RequestAttribute UUID userId) {

    Set<Chat> chats = chatService.getChats(userId);

    List<ChatDto> chatsDto = chatMapper.toDtoList(chats); 

    return new ResponseEntity<>(chatsDto, HttpStatus.OK);
  }

}
