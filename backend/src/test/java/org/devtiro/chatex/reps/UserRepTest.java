package org.devtiro.chatex.reps;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.devtiro.chatex.domain.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest
class UserRepTest {

  @Autowired
  private UserRep underTest;

  @Test
  void itShouldSaveUser() {

    User user = User.builder()
    .name("max")
    .username("max123")
    .email("max@mail.com")
    .phone("+43 333 22222")
    .key("max+1234")
    .build();

    User savedUser = underTest.save(user);

    assertNotNull(savedUser.getId());
    assertEquals("max123", savedUser.getUsername());

  }

}