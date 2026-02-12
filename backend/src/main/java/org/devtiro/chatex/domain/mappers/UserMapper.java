package org.devtiro.chatex.domain.mappers;

import org.devtiro.chatex.domain.dtos.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper interface for converting between User entities and DTOs.
 * Automatically generates implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Converts a User entity to a UserDto.
     *
     * @return UserDto containing mapped user information
     */
    UserDto toDto(User user);

}
