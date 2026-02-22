package org.devtiro.chatex.domain.exceptions;

import java.util.List;

import org.devtiro.chatex.domain.dtos.responses.ApiError;

import lombok.Getter;

/**
 * Custom runtime exception used to report one or more field-level validation errors.
 * Thrown when uniqueness constraints on user fields are violated during account creation.
 */
@Getter
public class OwnException extends RuntimeException {

  private final List<ApiError.FieldError> errors;

  /**
   * Constructs an OwnException with the given list of field errors.
   * Builds a summary message based on the number of errors for the stack trace.
   */
  public OwnException(List<ApiError.FieldError> errors) {
    // Needed for stack trace in the console, when the error is thrown
    super("Failed with " + errors.size() + " errors");
    this.errors = errors;
  }
  
}
