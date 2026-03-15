package org.devtiro.chatex.domain.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentlyViewedUsersDto {

  private String name;
  private String username;
  private String avatar;

}
