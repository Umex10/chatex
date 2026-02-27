package org.devtiro.chatex.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1")
public class HealthController {

  @GetMapping("/health")
  public ResponseEntity<String> checkHealth() {
    return ResponseEntity.ok("UP");
  }

}
