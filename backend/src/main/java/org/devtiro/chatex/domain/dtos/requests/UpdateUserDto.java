package org.devtiro.chatex.domain.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user profile update requests.
 * Contains the updatable profile fields that a user can change.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserDto {

  private String name;
  private String bio;
  private String location;
  private String website;
  
}
