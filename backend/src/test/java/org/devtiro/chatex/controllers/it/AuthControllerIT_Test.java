package org.devtiro.chatex.controllers.it;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.controllers.AuthController;
import org.devtiro.chatex.domain.TkName;
import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.JwtService;
import org.devtiro.chatex.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for {@link AuthController}.
 * Boots the full Spring application context with a random port and uses
 * {@link WebTestClient} to conduct real HTTP requests against the
 * authentication endpoints.
 *
 * @see AuthController
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AuthControllerIT_Test {

  private WebTestClient webTestClient;

  @LocalServerPort
  private int port;

  @Autowired
  private UserRep userRep;

  @Autowired
  private UserService userService;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private PasswordEncoder encoder;

  @BeforeEach
  void setUp() {
    userRep.deleteAll();
    this.webTestClient = WebTestClient.bindToServer()
        .baseUrl("http://localhost:" + port)
        .build();
  }

  /**
   * Verifies that the sign-up endpoint creates a new user, returns an access
   * token
   * with expiration info, and sets a refresh JWT cookie.
   * Also asserts that the user is persisted in the database.
   */
  @Test
  void bootTest_shouldSignUpUser() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();
    User user = TestData.createTestUser();

    webTestClient.post()
        .uri("/api/v1/auth/sign-up")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(requestDto)
        .exchange()
        // STATUS
        .expectStatus().isCreated()

        // COOKIE
        .expectCookie().exists("refresh_jwt")
        .expectCookie().httpOnly("refresh_jwt", true)

        // BODY
        .expectBody()
        .jsonPath("$.accessJwt").exists()
        .jsonPath("$.expiresIn").exists();

    // Database
    assertTrue(userRep.existsUserByUsername(user.getUsername()));
    assertTrue(userRep.existsUserByEmail(user.getEmail()));
    assertTrue(userRep.existsUserByPhone(user.getPhone()));

  }

  /**
   * Verifies that the sign-in endpoint authenticates an existing user, returns an
   * access token with expiration info, and sets a refresh JWT cookie.
   * Also asserts that the user still exists in the database.
   */
  @Test
  void bootTest_shouldSignInUser() {

    // create account with custom encoder, since the controller tests every element
    // If we wouldn't encode it, it would throw an error
    String key = encoder.encode(TestData.createTestUser().getKey());
    User user = TestData.createTestUser();
    user.setKey(key);
    userRep.save(user);

    SignInAccountRequestDto signInRequestDto = TestData.createSignInAccountRequestDto();

    webTestClient.post()
        .uri("/api/v1/auth/sign-in")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(signInRequestDto)
        .exchange()
        // STATUS
        .expectStatus().isOk()

        // COOKIE
        .expectCookie().exists("refresh_jwt")
        .expectCookie().httpOnly("refresh_jwt", true)

        // BODY
        .expectBody()
        .jsonPath("$.accessJwt").exists()
        .jsonPath("$.expiresIn").exists();

    // Database
    assertTrue(userRep.existsUserByUsername(user.getUsername()));
    assertTrue(userRep.existsUserByEmail(user.getEmail()));
    assertTrue(userRep.existsUserByPhone(user.getPhone()));

  }

  /**
   * Verifies that the access-jwt endpoint issues a new access token
   * when a valid refresh token cookie is provided.
   */
  @Test
  void bootTest_shouldCreateAccessJwt() {

    User user = TestData.createTestUser();

    // create account
    userRep.save(TestData.createTestUser());

    // Since a refresh tk is essential to create an access tk
    String refreshTk = jwtService.createRefreshTk(user.getUsername(),
        TkName.REFRESH);

    webTestClient.get()
        .uri("/api/v1/auth/access-jwt")
        .cookie("refresh_jwt", refreshTk)
        .exchange()
        // STATUS
        .expectStatus().isOk()

        // BODY
        .expectBody()
        .jsonPath("$.accessJwt").exists()
        .jsonPath("$.expiresIn").exists();
  }

}