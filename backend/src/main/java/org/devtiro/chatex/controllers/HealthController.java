package org.devtiro.chatex.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * REST controller that exposes a simple health-check endpoint.
 * Used to verify that the application is running and reachable.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1")
public class HealthController {

  /**
   * Returns a plain-text "UP" response to indicate that the service is healthy.
   *
   * @return ResponseEntity with HTTP 200 OK and the body {@code "UP"}
   */
  @GetMapping("/health")
  public ResponseEntity<String> checkHealth() {
    return ResponseEntity.ok("UP");
  }

}
