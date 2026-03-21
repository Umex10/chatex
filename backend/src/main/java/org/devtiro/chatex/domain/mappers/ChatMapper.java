package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.dtos.responses.ChatDto;
import org.devtiro.chatex.domain.dtos.responses.MessageDto;
import org.devtiro.chatex.domain.entities.Chat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {MessageMapper.class})
public abstract class ChatMapper {

  @Autowired
  protected MessageMapper messageMapper;

  @Mapping(source = "chatUser.name", target = "name")
  @Mapping(source = "chatUser.username", target = "username")
  @Mapping(source = "chatUser.avatar", target = "avatar")
  @Mapping(source = "chatUser.createdAt", target = "createdUserAt")
  @Mapping(source = "messages", target = "lastMessage", qualifiedByName = "getLastMessage")
  public abstract ChatDto toDto(Chat chat);

  public abstract List<ChatDto> toDtoList(Set<Chat> chats);

  @Named("getLastMessage")
  protected MessageDto getLastMessage(List<Message> messages) {
    if (messages == null || messages.isEmpty()) {
       return null;
    }
    return messageMapper.toDto(messages.getLast());
  }
}