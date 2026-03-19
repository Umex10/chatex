package org.devtiro.chatex.domain.mappers;

import org.devtiro.chatex.domain.dtos.responses.MessageDto;
import org.devtiro.chatex.domain.entities.Message;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface MessageMapper {

  @Mapping(source = "sender", target = "senderUsername", qualifiedByName = "getUsername")
  @Mapping(source = "receiver", target = "receiverUsername", qualifiedByName = "getUsername")
  MessageDto toDto(Message message);

  @Named("getUsername")
  default String getUsername(User user) {
    return user.getUsername();
  }
}
