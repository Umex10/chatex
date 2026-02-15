package org.devtiro.chatex.reps;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

/**
 * Repository tests for {@link UserRep}.
 * Uses {@link org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest} to bootstrap
 * a minimal JPA context with an in-memory database for verifying custom query methods.
 */
@DataJpaTest
public class UserRepTest {

  @Autowired
  private UserRep underTest;

  

  /**
   * Verifies that {@link UserRep#findByUsername(String)} returns an empty Optional
   * when the user does not exist, and a present Optional after the user is persisted.
   */
  @Test
  void itShouldFindUserByUsername() {

    // Data
    User user = TestData.createTestUser();

    // User not in the database
    assertFalse(underTest.findByUsername(user.getUsername()).isPresent());

    // save the user to the h2 database
    underTest.save(user);

    // User in the database
    assertTrue(underTest.findByUsername(user.getUsername()).isPresent());

  }

  /**
   * Verifies that the existence checks by username, email, and phone
   * correctly return {@code false} before and {@code true} after persisting a user.
   */
  @Test
  void itShouldCheckIfUserExistsByVariousFields() {

    // Data
    User user = TestData.createTestUser();
    String username = user.getUsername();
    String email = user.getEmail();
    String phone = user.getPhone();

    // User not in the database
    assertFalse(underTest.existsUserByUsername(username));
    assertFalse(underTest.existsUserByEmail(email));
    assertFalse(underTest.existsUserByPhone(phone));

    // save the user to the h2 database
    underTest.save(user);

    // User in the database
    assertTrue(underTest.existsUserByUsername(username));
    assertTrue(underTest.existsUserByEmail(email));
    assertTrue(underTest.existsUserByPhone(phone));
  }
}