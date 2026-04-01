package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.dtos.responses.ChatDto;
import org.devtiro.chatex.domain.dtos.responses.MessageDto;
import org.devtiro.chatex.domain.entities.Chat;
import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = { MessageMapper.class })
/**
 * Mapping component responsible for translating Chat entities into ChatDto models.
 * Extracts relevant user context and formats last messages properly.
 */
public abstract class ChatMapper {

  @Autowired
  protected MessageMapper messageMapper;

  @Mapping(target = "name", ignore = true)
  @Mapping(target = "username", ignore = true)
  @Mapping(target = "avatar", ignore = true)
  @Mapping(target = "createdUserAt", ignore = true)
  @Mapping(source = "messages", target = "lastMessage", qualifiedByName = "getLastMessage")
  @Mapping(source = "messages", target = "unseenMessages", qualifiedByName = "getUnseenMessagesCount")
  public abstract ChatDto toDto(Chat chat, @Context UUID currentUserId);

  public abstract List<ChatDto> toDtoList(Set<Chat> chats, @Context UUID currentUserId);

  @AfterMapping
  protected void setChatWith(Chat chat, @MappingTarget ChatDto dto, @Context UUID currentUserId) {

    User chatWith = chat.getChatUser().getId().equals(currentUserId)
        ? chat.getMe()
        : chat.getChatUser();
    if (chatWith != null) {
      dto.setName(chatWith.getName());
      dto.setUsername(chatWith.getUsername());
      dto.setAvatar(chatWith.getAvatar());
      dto.setCreatedUserAt(chatWith.getCreatedAt());
    }
  }

  @Named("getLastMessage")
  protected MessageDto getLastMessage(List<Message> messages) {
    if (messages == null || messages.isEmpty()) {
      return null;
    }
    return messageMapper.toDto(messages.getLast());
  }

  @Named("getUnseenMessagesCount")
  protected long getUnseenMessagesCount(List<Message> messages) {
    if (messages == null || messages.isEmpty()) {
      return 0;
    }

    return messages.stream()
        .filter(m -> m.isSeen() == false).count();
  }
}