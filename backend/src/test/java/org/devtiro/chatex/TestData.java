package org.devtiro.chatex;

import org.devtiro.chatex.domain.entities.User;

public class TestData {

  public static User createTestUser() {
        return User.builder()
            .name("max")
            .username("max123")
            .email("max@mail.com")
            .phone("+43 333 22222")
            .key("max+1234")
            .build();
    }
  
}
