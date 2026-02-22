package org.devtiro.chatex.controllers;

import org.springframework.security.core.AuthenticationException;

import org.devtiro.chatex.domain.dtos.responses.ApiError;
import org.devtiro.chatex.domain.exceptions.OwnException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@ControllerAdvice
@Slf4j
public class ErrorController {

  @ExceptionHandler(OwnException.class)
  public ResponseEntity<ApiError> handleEntityExistsException(OwnException ex) {
    ApiError error = ApiError.builder()
    .status(HttpStatus.BAD_REQUEST.value())
    .message("There are details that are already taken by others.")
    .errors(ex.getErrors())
    .build();

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
  
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex) {
    ApiError error = ApiError.builder()
    .status(HttpStatus.UNAUTHORIZED.value())
    .message("The credentials are incorrect.")
    .build();

    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }
}
