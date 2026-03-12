package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.enums.TkName;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.ipl.JwtServiceIpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import jakarta.servlet.http.Cookie;

/**
 * Unit tests for {@link JwtServiceIpl}.
 * Validates JWT creation, validation, and extraction logic
 * using a manually injected secret key and mocked dependencies.
 */
@ExtendWith(MockitoExtension.class)
public class JwtServiceIplTest {

  // The class that we mock
  @Mock
  private UserDetailsService userDetailsService;

  // The class to test
  @InjectMocks
  private JwtServiceIpl underTest;

  @BeforeEach
  void setUp() {
    // Since we are writing unit tests in this class, we need to fill the secret_key manually
    // Normally, boot would do this for us.
    ReflectionTestUtils.setField(underTest, "secretKey", "meinSehrLangesTestSecretDasMindestens32ZeichenHat123!");
  }

  /**
   * Verifies that an access token is successfully generated for a given username.
   */
  @Test
  void itShouldCreateAccessToken() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    String accessTk = underTest.createAccessTk(username, TkName.ACCESS);

    assertNotNull(accessTk);
  }

  /**
   * Verifies that a refresh token is successfully generated and is not blank.
   */
  @Test
  void itShouldCreateRefreshToken() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    String refreshTk = underTest.createRefreshTk(username, TkName.REFRESH);

    assertNotNull(refreshTk);
    assertFalse(refreshTk.isBlank());
  }

  /**
   * Verifies that a valid token is correctly parsed and the associated
   * {@link org.springframework.security.core.userdetails.UserDetails} is returned.
   */
  @Test
  void itShouldValidateToken() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    String accessTk = underTest.createAccessTk(username, TkName.ACCESS);

    // Should return this instance
    UserDetails customUserDetails = new CustomUserDetails(user);
    when(userDetailsService.loadUserByUsername(username)).thenReturn(customUserDetails);

    UserDetails userDetails = underTest.validateTk(accessTk);
    assertTrue(customUserDetails.getUsername().equals(userDetails.getUsername()));
  }

  /**
   * Verifies that the refresh token is correctly extracted from the request cookies.
   */
  @Test
  void itShouldExtractRefreshToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    Cookie cookie = new Cookie("refresh_jwt", "Refresh Token");
    request.setCookies(cookie);

    String refreshTk = underTest.extractRefreshTk(request);

    assertNotNull(refreshTk);

    assertEquals(cookie.getValue(), refreshTk);
  }

  /**
   * Verifies that {@code null} is returned when no refresh token cookie is present.
   */
   @Test
  void itShouldNotExtractRefreshToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    String refreshTk = underTest.extractRefreshTk(request);

    assertNull(refreshTk);
  }


  /**
   * Verifies that the access token is correctly extracted from the Authorization header.
   */
  @Test
  void itShouldExtractAccessToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();
    String headerName = "Authorization";
    String rawTk = "Access Token";
    String headerValue = "Bearer " + rawTk;

    request.addHeader(headerName, headerValue);

    String accessTk = underTest.extractAccesTk(request);

    assertNotNull(accessTk);

    assertEquals(rawTk, accessTk);
  }

  /**
   * Verifies that {@code null} is returned when no Authorization header is present.
   */
  @Test
  void itShouldNotExtractAccessToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    String accessTk = underTest.extractAccesTk(request);

    assertNull(accessTk);
  }
}
