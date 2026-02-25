package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FollowMapper {

  FollowDto toDto(User user);

  List<FollowDto> toDtoList(Set<User> users);
  
}
