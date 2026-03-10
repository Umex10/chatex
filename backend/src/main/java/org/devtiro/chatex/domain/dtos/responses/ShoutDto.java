package org.devtiro.chatex.domain.dtos.responses;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a shout in API responses.
 * Includes flattened author info, engagement counts, and flags indicating
 * whether the requesting user has liked or re-shouted this shout.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoutDto {
  private UUID id;
  private String name;
  private String username;
  private String avatar;
  private String text;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate createdAt;
  private List<String> images;
  private int likesCount;
  private int reShoutsCount;
  private int commentsCount;
  private boolean userLikingTheShout;
  private boolean userReShoutingTheShout;
}