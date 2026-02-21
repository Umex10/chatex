package org.devtiro.chatex.domain.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
