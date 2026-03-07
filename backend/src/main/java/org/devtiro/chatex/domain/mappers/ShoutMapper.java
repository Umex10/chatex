package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ShoutMapper {

  @Mapping(source = "user.name", target = "name")
  @Mapping(source = "user.username", target = "username")
  @Mapping(source = "user.avatar", target = "avatar")
  @Mapping(source = "likedBy", target = "likesCount", qualifiedByName = "calculateLikesCount")
  @Mapping(source = "reShoutedBy", target = "reShoutsCount", qualifiedByName = "calculateReShoutsCount")
  @Mapping(target = "userLikingTheShout", ignore = true)
  @Mapping(target = "userReShoutingTheShout", ignore = true)
  ShoutDto toDto(Shout shout);

  List<ShoutDto> toDtoList(List<Shout> shouts);

  @Named("calculateLikesCount")
  default int calculateLikesCount(Set<User> likedBy) {
    if (likedBy == null) {
      return 0;
    }

    return likedBy.size();
  }

  @Named("calculateReShoutsCount")
  default int calculateReShoutsCount(Set<User> reShoutedBy) {
    if (reShoutedBy == null) {
      return 0;
    }

    return reShoutedBy.size();
  }
}
