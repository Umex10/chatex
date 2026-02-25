package org.devtiro.chatex.domain.mappers;

import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * MapStruct mapper interface for converting between User entity and UserDto.
 * Spring manages the generated implementation as a bean.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

  /**
   * Maps a User entity to a UserDto response object.
   *
   * @return the mapped UserDto
   */
  @Mapping(target = "followersCount", source = "followers", qualifiedByName = "calculateFollowersCount")
  @Mapping(target = "followingCount", source = "following", qualifiedByName = "calculateFollowingCount")
  UserDto toDto(User user);

  @Named("calculateFollowersCount")
  default int calculateFollowersCount(Set<User> followers) {
    if (followers == null) {
      return 0;
    }

    return followers.size();
  }

  @Named("calculateFollowingCount")
  default int calculateFollowingCount(Set<User> following) {
    if (following == null) {
      return 0;
    }

    return following.size();
  }
}
