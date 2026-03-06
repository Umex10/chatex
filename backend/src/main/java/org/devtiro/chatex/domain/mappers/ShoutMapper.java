package org.devtiro.chatex.domain.mappers;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ShoutDto;
import org.devtiro.chatex.domain.entities.Shout;
import org.mapstruct.Mapper;

@Mapper
public interface ShoutMapper {
  
  ShoutDto toDto(Shout shout);

  List<ShoutDto> toDtoList(List<Shout> shouts);

}
