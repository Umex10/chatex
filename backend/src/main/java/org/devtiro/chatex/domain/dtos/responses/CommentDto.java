package org.devtiro.chatex.domain.dtos.responses;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a comment on a shout.
 * Delivers text and structural hierarchy back to the client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CommentDto {

  private UUID commentedShoutId;
  private String commentedShoutUsername;

}
