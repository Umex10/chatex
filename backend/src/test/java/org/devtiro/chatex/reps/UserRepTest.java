package org.devtiro.chatex.reps;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest
public class UserRepTest {

  @Autowired
  private UserRep underTest;

  

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