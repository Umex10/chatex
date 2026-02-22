package org.devtiro.chatex.domain.mappers;

import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

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
  UserDto toDto(User user);
  
}
