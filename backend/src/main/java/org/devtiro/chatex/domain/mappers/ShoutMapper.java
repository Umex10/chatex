package org.devtiro.chatex.domain.mappers;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShoutMapper {

  @Mapping(source = "user.name", target = "name")
  @Mapping(source = "user.username", target = "username")
  @Mapping(source = "user.avatar", target = "avatar")
  ShoutDto toDto(Shout shout);

  List<ShoutDto> toDtoList(List<Shout> shouts);

}
