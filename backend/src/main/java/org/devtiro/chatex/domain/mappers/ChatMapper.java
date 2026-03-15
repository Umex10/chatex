package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.dtos.responses.ChatDto;
import org.devtiro.chatex.domain.entities.Chat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ChatMapper {

  @Mapping(source = "chatUser.name", target = "name")
  @Mapping(source = "chatUser.username", target = "username")
  @Mapping(source = "chatUser.avatar", target = "avatar")
  @Mapping(source = "chatUser.createdAt", target = "createdUserAt")
  @Mapping(source = "messages", target = "lastMessage", qualifiedByName = "getLastMessage")
  ChatDto toDto(Chat chat);

  List<ChatDto> toDtoList(Set<Chat> chats);

  @Named("getLastMessage")
  default Message getLastMessage(List<Message> messages) {
    
    if (messages == null || messages.size() == 0) return null;

    return messages.getLast();
  }


}
