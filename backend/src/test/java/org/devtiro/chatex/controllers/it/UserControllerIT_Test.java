package org.devtiro.chatex.controllers.it;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.TkName;
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.JwtService;
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
  private JwtService jwtService;

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

    // create account
    User user = userRep.save(TestData.createTestUser());

    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    UserDto userDto = userMapper.toDto(user);

    webTestClient.get()
        .uri("/api/v1/user")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.name").isEqualTo(userDto.getName())
        .jsonPath("$.username").isEqualTo(userDto.getUsername());

  }

  @Test
  void bootTest_ShouldGetUserByUsername() {

    User targetUser = userRep.save(TestData.createTestUser());
    User requestingUser = userRep.save(TestData.createTestUser("test_user_2"));

    String accessTk = jwtService.createAccessTk(requestingUser.getUsername(), TkName.ACCESS);

    webTestClient.get()
        .uri("/api/v1/user/" + targetUser.getUsername())
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.name").isEqualTo(targetUser.getName())
        .jsonPath("$.username").isEqualTo(targetUser.getUsername());

  }

  @Test
  void bootTest_ShouldUpdateUser() {

    User user = userRep.save(TestData.createTestUser());
    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    UpdateUserDto updateUserDto = UpdateUserDto.builder()
        .name("new name")
        .avatar("new avatar")
        .banner("new banner")
        .bio("new bio")
        .location("new location")
        .website("new website")
        .build();

    webTestClient.patch()
        .uri("/api/v1/user")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .bodyValue(updateUserDto)
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.name").isEqualTo(updateUserDto.getName())
        .jsonPath("$.avatar").isEqualTo(updateUserDto.getAvatar())
        .jsonPath("$.bio").isEqualTo(updateUserDto.getBio());
  }

  @Test
  void bootTest_ShouldGetFollowersList() {
    // create account
    User user = userRep.save(TestData.createTestUser());

    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    webTestClient.get()
        .uri("/api/v1/user/followers/" + user.getUsername()) // "own" list
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.length()").isEqualTo(0);
  }

  @Test
  void bootTest_ShouldGetFollowingList() {
    // create account
    User user = userRep.save(TestData.createTestUser());

    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    webTestClient.get()
        .uri("/api/v1/user/following/" + user.getUsername()) // "own" list
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.length()").isEqualTo(0);
  }

  @Test
  void bootTest_UserShouldFollowTarget() {
    User targetUser = userRep.save(TestData.createTestUser());
    User requestingUser = userRep.save(TestData.createTestUser("test_user_2"));

    String accessTk = jwtService.createAccessTk(requestingUser.getUsername(), TkName.ACCESS);

    webTestClient.post()
        .uri("/api/v1/user/follow/" + targetUser.getUsername())
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .isEmpty(); // Sending void back

    assertTrue(userRep.isUserFollowingTarget(targetUser.getUsername(), requestingUser.getId()));
  }

  @Test
  void bootTest_UserShouldUnfollowTarget() {
    User targetUser = userRep.save(TestData.createTestUser());
    User requestingUser = userRep.save(TestData.createTestUser("test_user_2"));

    String accessTk = jwtService.createAccessTk(requestingUser.getUsername(), TkName.ACCESS);

    webTestClient.post()
        .uri("/api/v1/user/unfollow/" + targetUser.getUsername())
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .isEmpty(); // Sending void back

    assertFalse(userRep.isUserFollowingTarget(targetUser.getUsername(), requestingUser.getId()));
  }
}
