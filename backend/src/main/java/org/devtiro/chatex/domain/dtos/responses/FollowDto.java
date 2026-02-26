package org.devtiro.chatex.domain.dtos.responses;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowDto {

  private UUID id;
  private String name;
  private String username;
  private String avatar;
  private String bio;
  private boolean userFollowingTarget;
  private boolean targetFollowingUser;

}
