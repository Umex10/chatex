package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a user's public profile data.
 * Used in API responses to expose user information to clients.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

  private String name;
  private String username;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate createdAt;
  private int followersCount; 
  private int followingCount;
  private boolean userFollowingTarget;
  private String avatar;
  private String banner;
  private String bio;
  private String location;
  private String website;
  
}
