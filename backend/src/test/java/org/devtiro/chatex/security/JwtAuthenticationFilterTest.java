package org.devtiro.chatex.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.services.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {

  @Mock
  private JwtService jwtService;

  @InjectMocks
  private JwtAuthenticationFilter underTest;

  @Test
  void shouldDoFilterInternal() throws Exception {

    User user = TestData.createTestUser();
    UUID userId = new UUID(30L, 2);
    user.setId(userId);
    UserDetails userDetails = new CustomUserDetails(user);

    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();
    MockFilterChain filterChain = new MockFilterChain();

    String accessTk = "Access Token";

    when(jwtService.extractAccesTk(request)).thenReturn(accessTk);
    when(jwtService.validateTk(accessTk)).thenReturn(userDetails);

    underTest.doFilterInternal(request, response, filterChain);

    var auth = SecurityContextHolder.getContext().getAuthentication();
    assertNotNull(auth, "Authentication is not defined!");
    assertEquals(userDetails, auth.getPrincipal());

    assertEquals(userId, request.getAttribute("userId"));

    SecurityContextHolder.clearContext();

  }

  @Test
  void shouldNotDoFilterInternalWithError() throws Exception {

    User user = TestData.createTestUser();
    UUID userId = new UUID(30L, 2);
    user.setId(userId);

    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();
    MockFilterChain filterChain = new MockFilterChain();

    String accessTk = "Access Token";

    when(jwtService.extractAccesTk(request)).thenReturn(accessTk);
    when(jwtService.validateTk(accessTk))
        .thenThrow(new UsernameNotFoundException("Username was not found!"));

    underTest.doFilterInternal(request, response, filterChain);

    var auth = SecurityContextHolder.getContext().getAuthentication();
    assertNull(auth, "Authentication is not defined!");

  }


  @Test
  void shouldNotDoFilterInternalWithNullToken() throws Exception {
    
    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();
    MockFilterChain filterChain = new MockFilterChain();

    when(jwtService.extractAccesTk(request)).thenReturn(null);
   
    underTest.doFilterInternal(request, response, filterChain);

    var auth = SecurityContextHolder.getContext().getAuthentication();
    assertNull(auth, "Authentication is not defined!");

  }

}
