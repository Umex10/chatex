package org.devtiro.chatex.controllers.it;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.reps.UserRep;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for {@link org.devtiro.chatex.controllers.ErrorController}.
 * Boots the full Spring application context with a random pt and uses
 * {@link WebTestClient} to verify that custom exceptions are properly handled
 * and return the expected error responses.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ErrorControllerIT_Test {

  private WebTestClient webTestClient;

  @LocalServerPort
  private int port;

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
   * Verifies that when attempting to sign up with details that already exist,
   * an {@link org.devtiro.chatex.domain.exceptions.OwnException} is handled and
   * returned as a 400 Bad Request with appropriate field errors.
   */
  @Test
  void bootTest_shouldHandleOwnException() {

    SignUpAccountRequestDto duplicateDto = TestData.createSignUpAccountRequestDto();

     // create account
    userRep.save(TestData.createTestUser());

    // Create account but the account already exists
    webTestClient.post()
        .uri("/api/v1/auth/sign-up")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(duplicateDto)
        .exchange()

        .expectStatus().isBadRequest()
        .expectBody()
        // error message
        .jsonPath("$.message").isEqualTo("There are details that are already taken by others.")

        // fields
        .jsonPath("$.errors[?(@.field == 'email')]").exists()
        .jsonPath("$.errors[?(@.field == 'username')]").exists()
        .jsonPath("$.errors.length()").isEqualTo(3)
        .jsonPath("$.errors").isArray();
  }

  /**
   * Verifies that when attempting to sign in with incorrect credentials,
   * an {@link org.springframework.security.core.AuthenticationException} is handled
   * and returned as a 401 Unauthorized with an appropriate error message.
   */
  @Test
  void bootTest_shouldHandleAuthenticationException() {

    // Not existing user
    SignInAccountRequestDto signInRequestDto = TestData.createSignInAccountRequestDto();

    webTestClient.post()
        .uri("/api/v1/auth/sign-in")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(signInRequestDto)
        .exchange()

        .expectStatus().isUnauthorized()
        .expectBody()
        .jsonPath("$.message").isEqualTo("The credentials are incorrect.");

  }

}
