package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoutDto {
  private UUID id;
  private String text;
  private LocalDate createdAt;
  private List<String> images;

  private String name;
  private String username;
  private String avatar;
}