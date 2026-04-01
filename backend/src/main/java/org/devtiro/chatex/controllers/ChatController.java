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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/chat")
@RequiredArgsConstructor
/**
 * REST controller for managing direct messages and chat rooms.
 * Provides endpoints for retrieving, creating, and deleting chats.
 */
public class ChatController {

  private final ChatService chatService;
  private final ChatMapper chatMapper;

  @GetMapping(path = "/chats")
  /**
   * Retrieves all active, non-silenced chats for the authenticated user.
   *
   * @param userId the ID of the authenticated user
   * @return ResponseEntity containing a list of ChatDto objects
   */
  public ResponseEntity<List<ChatDto>> getChats(@RequestAttribute UUID userId) {

    Set<Chat> chats = chatService.getChats(userId);

    List<ChatDto> chatsDto = chatMapper.toDtoList(chats, userId);

    return new ResponseEntity<>(chatsDto, HttpStatus.OK);
  }

  @GetMapping(path = "/silencedChats")
  /**
   * Retrieves all silenced or muted chats for the authenticated user.
   *
   * @param userId the ID of the authenticated user
   * @return ResponseEntity containing a list of silenced ChatDto objects
   */
  public ResponseEntity<List<ChatDto>> getSilencedChats(@RequestAttribute UUID userId) {

    Set<Chat> chats = chatService.getSilencedChats(userId);

    List<ChatDto> chatsDto = chatMapper.toDtoList(chats, userId);

    return new ResponseEntity<>(chatsDto, HttpStatus.OK);
  }

  @GetMapping(path = "/{chatId}")
  /**
   * Retrieves details for a specific chat by its ID.
   *
   * @param chatId the unique identifier of the chat
   * @param userId the ID of the authenticated user requesting the chat
   * @return ResponseEntity containing the requested ChatDto
   */
  public ResponseEntity<ChatDto> getChat(@PathVariable UUID chatId, @RequestAttribute UUID userId) {

    Chat chat = chatService.getChat(chatId, userId);

    ChatDto chatDto = chatMapper.toDto(chat, userId);

    return new ResponseEntity<>(chatDto, HttpStatus.OK);
  }

  @DeleteMapping(path = "/{chatId}")
  /**
   * Deletes a chat room or direct message thread permanently.
   *
   * @param chatId the unique identifier of the chat to delete
   * @return ResponseEntity without content, HTTP status 200 OK
   */
  public ResponseEntity<Void> deleteChat(@PathVariable UUID chatId) {

    chatService.deleteChat(chatId);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @PostMapping(path = "/{username}")
  /**
   * Initiates a new chat with a specified user by their username.
   *
   * @param username the username of the target user
   * @param userId   the ID of the authenticated user creating the chat
   * @return ResponseEntity containing the newly created ChatDto
   */
  public ResponseEntity<ChatDto> createChat(@PathVariable String username,
      @RequestAttribute UUID userId) {

    Chat chat = chatService.createChat(username, userId);

    ChatDto chatDto = chatMapper.toDto(chat, userId);

    return new ResponseEntity<>(chatDto, HttpStatus.OK);
  }

}
