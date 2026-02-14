package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.TkName;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.ipl.JwtServiceIpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import jakarta.servlet.http.Cookie;

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
    // Hier setzt du den Secret Key manuell für den Test
    // "secretKey" muss exakt so heißen wie der Variablenname in deiner Klasse
    ReflectionTestUtils.setField(underTest, "secretKey", "meinSuperLangesTestSecretDasMindestens32ZeichenHat123!");
  }

  @Test
  void itShouldCreateAccessToken() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    String accessTk = underTest.createAccessTk(username, TkName.ACCESS);

    assertNotNull(accessTk);
  }

  @Test
  void itShouldCreateRefreshToken() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    MockHttpServletResponse response = new MockHttpServletResponse();

    underTest.createRefreshTk(username, TkName.REFRESH, response);

    // Did createRefreshTk set the cookie?
    Cookie cookie = response.getCookie("refresh_jwt");
    assertNotNull(cookie);
    assertFalse(cookie.getValue().isBlank());
    assertTrue(cookie.isHttpOnly());
    assertEquals(cookie.getMaxAge(), 30 * 24 * 60 * 60);
  }

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

  @Test
  void itShouldExtractRefreshToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    Cookie cookie = new Cookie("refresh_jwt", "Refresh Token");
    request.setCookies(cookie);

    String refreshTk = underTest.extractRefreshTk(request);

    assertNotNull(refreshTk);

    assertEquals(cookie.getValue(), refreshTk);
  }

   @Test
  void itShouldNotExtractRefreshToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    String refreshTk = underTest.extractRefreshTk(request);

    assertNull(refreshTk);
  }


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

  @Test
  void itShouldNotExtractAccessToken() {

    MockHttpServletRequest request = new MockHttpServletRequest();

    String accessTk = underTest.extractAccesTk(request);

    assertNull(accessTk);
  }
}
