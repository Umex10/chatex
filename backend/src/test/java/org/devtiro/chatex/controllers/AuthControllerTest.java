package org.devtiro.chatex.controllers;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.*;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.TkName;
import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.AuthResponseDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.AuthenticationService;
import org.devtiro.chatex.services.JwtService;
import org.devtiro.chatex.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

import jakarta.servlet.http.Cookie;

public class AuthControllerTest {

  @Mock
  private UserService userService;

  @Mock
  private AuthenticationService authenticationService;

  @Mock
  private JwtService jwtService;

  @InjectMocks
  private AuthController authController;

  @BeforeEach
  void init() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void itShouldSignUpAccount() throws Exception {
    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();
    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userService.createAccount(requestDto)).thenReturn(user);
    when(jwtService.createAccessTk(username, TkName.ACCESS)).thenReturn("Access Token");

    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();

    ResponseEntity<AuthResponseDto> responseEntity = authController
        .signUpAccount(requestDto, request, response);

    assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
    assertEquals("Access Token", (responseEntity.getBody()).getAccessJwt());
    assertEquals(15 * 60L, (responseEntity.getBody()).getExpiresIn());

    verify(jwtService).createRefreshTk(eq(username), eq(TkName.REFRESH), any());
    verify(jwtService).createAccessTk(username, TkName.ACCESS);
  }

  @Test
  void itShouldSignInAccount() throws Exception {
    SignInAccountRequestDto requestDto = TestData.createSignInAccountRequestDto();
    User user = TestData.createTestUser();
    String username = user.getUsername();
    UserDetails userDetails = new CustomUserDetails(user);

    when(authenticationService.authenticate(username, user.getKey())).thenReturn(userDetails);
    when(jwtService.createAccessTk(username, TkName.ACCESS)).thenReturn("Access Token");

    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();

    ResponseEntity<AuthResponseDto> responseEntity = authController
        .signInAccount(requestDto, request, response);

    assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    assertEquals("Access Token", (responseEntity.getBody()).getAccessJwt());
    assertEquals(15 * 60L, (responseEntity.getBody()).getExpiresIn());

    verify(jwtService).createRefreshTk(eq(username), eq(TkName.REFRESH), any());
    verify(jwtService).createAccessTk(username, TkName.ACCESS);
  }

  @Test
  void itShouldReturnAccessJwt() throws Exception {
    User user = TestData.createTestUser();
    UserDetails userDetails = new CustomUserDetails(user);
    String refreshTk = "Refresh Token";

    when(jwtService.extractRefreshTk(any())).thenReturn(refreshTk);
    when(jwtService.validateTk(refreshTk)).thenReturn(userDetails);
    when(jwtService.createAccessTk(user.getUsername(), TkName.ACCESS)).thenReturn("Access Token");

    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setCookies(new Cookie("refreshTk", refreshTk));
    MockHttpServletResponse response = new MockHttpServletResponse();

    ResponseEntity<?> responseEntity = authController.createAccessJwt(request, response);

    AuthResponseDto body = (AuthResponseDto) responseEntity.getBody();

    assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    assertEquals("Access Token", (body).getAccessJwt());
    assertEquals(15 * 60L, (body).getExpiresIn());

  }

  @Test
  void itShouldNotReturnAccessJwt() throws Exception {
    User user = TestData.createTestUser();
    UserDetails userDetails = new CustomUserDetails(user);
    String refreshTk = "Refresh Token";

    when(jwtService.extractRefreshTk(any())).thenReturn(null);
    when(jwtService.validateTk(refreshTk)).thenReturn(userDetails);
    when(jwtService.createAccessTk(user.getUsername(), TkName.ACCESS)).thenReturn("Access Token");

    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();

    ResponseEntity<?> responseEntity = authController.createAccessJwt(request, response);

    assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());

  }
}
