package org.devtiro.chatex.domain.mappers;

import org.devtiro.chatex.domain.dtos.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

}
