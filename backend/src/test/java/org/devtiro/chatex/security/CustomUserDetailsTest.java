package org.devtiro.chatex.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.junit.jupiter.api.Test;

public class CustomUserDetailsTest {

  @Test
  void shouldWrapUserCorrectly() {

    User user = TestData.createTestUser();
    UUID userId = UUID.randomUUID();
    user.setId(userId);

    CustomUserDetails details = new CustomUserDetails(user);

    assertEquals(userId, details.getId());
    assertEquals(user.getUsername(), details.getUsername());
    assertEquals(user.getKey(), details.getPassword());
    assertTrue(details.isEnabled()); // Testet deine harten "true" Rückgaben
  }

}
