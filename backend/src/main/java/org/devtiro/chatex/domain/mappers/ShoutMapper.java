package org.devtiro.chatex.domain.mappers;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
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
  @Mapping(source = "likedBy", target = "likesCount", qualifiedByName = "countCollection")
  @Mapping(source = "reShoutedBy", target = "reShoutsCount", qualifiedByName = "countCollection")
  @Mapping(source = "comments", target = "commentsCount", qualifiedByName = "countCollection")
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
   * Counts the number of the given List or Set.
   * Returns 0 if the provided set is {@code null}.
   *
   * @return the number (length) of the List or Set
   */
  @Named("countCollection")
  default int countCollection(java.util.Collection<?> collection) {
    return (collection == null) ? 0 : collection.size();
  }
}
