package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * MapStruct mapper interface for converting between Shout entity and ShoutDto.
 * Flattens the nested User fields (name, username, avatar) and computes
 * engagement counts from the likes and re-shout sets.
 * Spring manages the generated implementation as a bean.
 */
@Mapper(componentModel = "spring")
public interface ShoutMapper {

  /**
   * Maps a Shout entity to a ShoutDto response object.
   * Author info is flattened from the nested User, and engagement counts are
   * computed via named helper methods. The {@code userLikingTheShout} and
   * {@code userReShoutingTheShout} flags are intentionally ignored here and must
   * be set manually after mapping.
   *
   * @return the mapped ShoutDto
   */
  @Mapping(source = "user.name", target = "name")
  @Mapping(source = "user.username", target = "username")
  @Mapping(source = "user.avatar", target = "avatar")
  @Mapping(source = "likedBy", target = "likesCount", qualifiedByName = "calculateLikesCount")
  @Mapping(source = "reShoutedBy", target = "reShoutsCount", qualifiedByName = "calculateReShoutsCount")
  @Mapping(target = "userLikingTheShout", ignore = true)
  @Mapping(target = "userReShoutingTheShout", ignore = true)
  ShoutDto toDto(Shout shout);

  /**
   * Maps a list of Shout entities to a list of ShoutDto objects.
   *
   * @return a list of mapped ShoutDto objects
   */
  List<ShoutDto> toDtoList(List<Shout> shouts);

  /**
   * Counts the number of users who liked the shout.
   * Returns 0 if the provided set is {@code null}.
   *
   * @return the number of likes, or 0 if the set is null
   */
  @Named("calculateLikesCount")
  default int calculateLikesCount(Set<User> likedBy) {
    if (likedBy == null) {
      return 0;
    }

    return likedBy.size();
  }

  /**
   * Counts the number of users who re-shouted the shout.
   * Returns 0 if the provided set is {@code null}.
   *
   * @return the number of re-shouts, or 0 if the set is null
   */
  @Named("calculateReShoutsCount")
  default int calculateReShoutsCount(Set<User> reShoutedBy) {
    if (reShoutedBy == null) {
      return 0;
    }

    return reShoutedBy.size();
  }
}
