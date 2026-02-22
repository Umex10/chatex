package org.devtiro.chatex.domain.dtos.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a structured API error response.
 * Includes an HTTP status code, a human-readable message, and an optional list of field-level errors.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {

  private int status;
  private String message;
  private List<FieldError> errors;

  /**
   * Represents a validation error for a specific request field.
   */
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class FieldError {
    private String field;
    private String message;
  }
}