package org.devtiro.chatex.domain.dtos.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiError {

  private int status;
  private String message;
  private List<FieldError> errors;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class FieldError {
    private String field;
    private String message;
  }
}