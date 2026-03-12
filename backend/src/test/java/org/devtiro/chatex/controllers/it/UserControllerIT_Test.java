package org.devtiro.chatex.controllers.it;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.enums.TkName;
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

/**
 * Integration tests for {@link org.devtiro.chatex.controllers.UserController}.
 * Boots the full Spring application context with a random pt and uses
 * {@link WebTestClient} to conduct real HTTP requests against the
 * user management endpoints.
 */
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

  /**
   * Verifies that an authenticated user can retrieve their own profile data
   * by making a GET request to the /user endpoint.
   */
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

  /**
   * Verifies that an authenticated user can retrieve another user's profile
   * by username by making a GET request to /user/{username}.
   */
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

  /**
   * Verifies that an authenticated user can successfully update their own profile
   * by making a PATCH request with updated field values.
   */
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

  /**
   * Verifies that an authenticated user can retrieve a user's followers list
   * by making a GET request to /user/followers/{username}.
   * Expects an empty list for a new user with no followers.
   */
  @Test
  void bootTest_ShouldGetFollowersList() {
    // create account
    User user = userRep.save(TestData.createTestUser());

    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    webTestClient.get()
        .uri("/api/v1/follow/" + user.getUsername() + "/followers") // "own" list
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.length()").isEqualTo(0);
  }

  /**
   * Verifies that an authenticated user can retrieve a user's following list
   * by making a GET request to /user/following/{username}.
   * Expects an empty list for a new user who is not following anyone.
   */
  @Test
  void bootTest_ShouldGetFollowingList() {
    // create account
    User user = userRep.save(TestData.createTestUser());

    String accessTk = jwtService.createAccessTk(user.getUsername(), TkName.ACCESS);

    webTestClient.get()
        .uri("/api/v1/follow/" + user.getUsername() + "/following") // "own" list
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.length()").isEqualTo(0);
  }

  /**
   * Verifies that the follow labels are correctly set in the FollowDto responses
   * when retrieving followers and following lists. Creates a bidirectional follow
   * relationship between two users and confirms that the flags isUserFollowingTarget
   * and isTargetFollowingUser are properly populated.
   */
  @Test
  void bootTest_shouldSetFollowLabel() {

    User user1 = userRep.save(TestData.createTestUser());
    User user2 = userRep.save(TestData.createTestUser("unique"));


    // Since it is an biderectional relation
    user1.setFollowers(new HashSet<>(Set.of(user2)));
    user1.setFollowing(new HashSet<>(Set.of(user2)));
    
    user2.setFollowing(new HashSet<>(Set.of(user1)));
    user2.setFollowers(new HashSet<>(Set.of(user1)));

    userRep.save(user1);
    userRep.save(user2);

    String accessTk = jwtService.createAccessTk(user1.getUsername(), TkName.ACCESS);

    List<FollowDto> followers = webTestClient.get()
        .uri("/api/v1/follow/" + user1.getUsername() + "/followers")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()
        .expectStatus().isOk()
        .expectBodyList(FollowDto.class)
        .returnResult()
        .getResponseBody();

    List<FollowDto> following = webTestClient.get()
        .uri("/api/v1/follow/" + user1.getUsername() + "/following")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()
        .expectStatus().isOk()
        .expectBodyList(FollowDto.class)
        .returnResult()
        .getResponseBody();

    assertTrue(followers.getFirst().isUserFollowingTarget());
    assertTrue(following.getFirst().isTargetFollowingUser());
  }

  /**
   * Verifies that an authenticated user can successfully follow another user
   * by making a POST request to /user/follow/{username}.
   * Confirms the follow relationship is persisted in the database.
   */
  @Test
  void bootTest_UserShouldFollowTarget() {
    User targetUser = userRep.save(TestData.createTestUser());
    User requestingUser = userRep.save(TestData.createTestUser("test_user_2"));

    String accessTk = jwtService.createAccessTk(requestingUser.getUsername(), TkName.ACCESS);

    webTestClient.post()
        .uri("/api/v1/follow/" + targetUser.getUsername() + "/follow")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .isEmpty(); // Sending void back

    assertTrue(userRep.isUserFollowingTarget(targetUser.getUsername(), requestingUser.getId()));
  }

  /**
   * Verifies that an authenticated user can successfully unfollow another user
   * by making a POST request to /user/unfollow/{username}.
   * Confirms the follow relationship is removed from the database.
   */
  @Test
  void bootTest_UserShouldUnfollowTarget() {
    User targetUser = userRep.save(TestData.createTestUser());
    User requestingUser = userRep.save(TestData.createTestUser("test_user_2"));

    String accessTk = jwtService.createAccessTk(requestingUser.getUsername(), TkName.ACCESS);

    webTestClient.post()
        .uri("/api/v1/follow/" + targetUser.getUsername() + "/unfollow")
        .headers(headers -> headers.setBearerAuth(accessTk))
        .exchange()

        .expectStatus().isOk()
        .expectBody()
        .isEmpty(); // Sending void back

    assertFalse(userRep.isUserFollowingTarget(targetUser.getUsername(), requestingUser.getId()));
  }
}
