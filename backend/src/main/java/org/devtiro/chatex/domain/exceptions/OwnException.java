package org.devtiro.chatex.domain.exceptions;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ApiError;

import lombok.Getter;

@Getter
public class OwnException extends RuntimeException {

  private final List<ApiError.FieldError> errors;

  public OwnException(List<ApiError.FieldError> errors) {
    // Needed for stack trace in the console, when the error is thrown
    super("Failed with " + errors.size() + " errors");
    this.errors = errors;
  }
  
}
