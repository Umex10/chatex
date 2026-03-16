package org.devtiro.chatex.domain.dtos.responses;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a user entry in a follower or following
 * list.
 * In addition to basic profile fields it carries two follow-status flags that
 * indicate the relationship between the requesting user and the listed user.
 */
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
  private boolean userSilencingTarget;
  private boolean targetSilencingUser;

}
