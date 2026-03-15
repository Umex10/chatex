package org.devtiro.chatex.domain.mappers;

import java.util.List;
import java.util.Set;

import org.devtiro.chatex.domain.dtos.responses.RecentlyViewedUsersDto;
import org.devtiro.chatex.domain.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RecentlyViewedUsersDtoMapper {

  RecentlyViewedUsersDto toDto(User user);

  List<RecentlyViewedUsersDto> toDtoList(Set<User> users);

}
