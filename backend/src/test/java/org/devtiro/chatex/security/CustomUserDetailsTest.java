package org.devtiro.chatex.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for {@link CustomUserDetails}.
 * Validates that the User entity is correctly wrapped and that
 * all UserDetails contract methods return the expected values.
 */
public class CustomUserDetailsTest {

  /**
   * Verifies that {@link CustomUserDetails} correctly delegates to the underlying
   * User entity for ID, username, password, and enabled status.
   */
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
