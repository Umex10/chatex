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
 * Data Transfer Object representing a quoted shout (re-post with comment).
 * Encapsulates the original shout details within the quoting context.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteDto {

  private UUID quotedShoutId;
  private String name;
  private String username;
  private String avatar;
  private String text;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate createdAt;
  private List<String> images;

}
