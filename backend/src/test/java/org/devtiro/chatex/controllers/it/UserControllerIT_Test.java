package org.devtiro.chatex.controllers.it;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerIT_Test {

  private WebTestClient webTestClient;

  @LocalServerPort
  private int port;

  @Autowired
  private UserService userService;

  @Autowired
  private UserMapper userMapper;

  @Autowired
  private UserRep userRep;

  @BeforeEach
  void setUp() {
    userRep.deleteAll();
    this.webTestClient = WebTestClient.bindToServer()
        .baseUrl("http://localhost:" + port)
        .build();
  }

  @Test
  void bootTest_ShouldGetUser() {
    SignUpAccountRequestDto duplicateDto = TestData.createSignUpAccountRequestDto();

    // create account
    User user = userService.createAccount(duplicateDto);
    UserDto userDto = userMapper.toDto(user);

    webTestClient.get()
        .uri("/api/v1/user")
        .attribute("userId", user.getId())
        .exchange()

        .expectStatus().isOk()
        .expectBody()

        .jsonPath("$.userDto").isEqualTo(userDto);
  }
}
