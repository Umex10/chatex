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
   * Follower and following counts are computed via named helper methods.
   * The {@code userFollowingTarget} flag is intentionally ignored here and must
   * be set manually after mapping.
   *
   * @return the mapped UserDto
   */
  @Mapping(target = "followersCount", source = "followers", qualifiedByName = "calculateFollowersCount")
  @Mapping(target = "followingCount", source = "following", qualifiedByName = "calculateFollowingCount")
  @Mapping(target = "userFollowingTarget", ignore = true)
  UserDto toDto(User user);

  /**
   * Counts the number of followers.
   * Returns 0 if the provided set is {@code null}.
   *
   * @return the number of followers, or 0 if the set is null
   */
  @Named("calculateFollowersCount")
  default int calculateFollowersCount(Set<User> followers) {
    if (followers == null) {
      return 0;
    }

    return followers.size();
  }

  /**
   * Counts the number of users the given user is following.
   * Returns 0 if the provided set is {@code null}.
   *
   * @return the size of the following set, or 0 if null
   */
  @Named("calculateFollowingCount")
  default int calculateFollowingCount(Set<User> following) {
    if (following == null) {
      return 0;
    }

    return following.size();
  }
}
