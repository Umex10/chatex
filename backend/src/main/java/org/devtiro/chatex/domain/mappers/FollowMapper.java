package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper interface for converting User entities to FollowDto
 * responses.
 * Used when returning follower/following lists that include follow-status badge
 * flags.
 * Spring manages the generated implementation as a bean.
 */
@Mapper(componentModel = "spring")
public interface FollowMapper {

  /**
   * Maps a single User entity to a FollowDto.
   * The badge flags ({@code userFollowingTarget}, {@code targetFollowingUser})
   * are
   * not populated here and must be set manually after mapping.
   *
   * @return the mapped FollowDto
   */
  FollowDto toDto(User user);

  List<FollowDto> toDtoList(List<User> users);

  /**
   * Maps a set of User entities to a list of FollowDto objects.
   * Converts the unordered Set to an ordered List suitable for API responses.
   *
   * @return a list of mapped FollowDto objects
   */
  List<FollowDto> toDtoList(Set<User> users);

}
