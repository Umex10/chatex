package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.ChatDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatMapper {
  
  ChatDto toDto(User user);

  List<ChatDto> toDtoList(Set<User> users);

}
