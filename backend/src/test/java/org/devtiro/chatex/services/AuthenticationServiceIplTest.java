package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.security.CustomUserDetails;
import org.devtiro.chatex.services.ipl.AuthServiceIpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Unit tests for {@link AuthServiceIpl}.
 * Validates that the authentication flow correctly delegates to the
 * {@link org.springframework.security.authentication.AuthenticationManager}
 * and returns the expected {@link org.springframework.security.core.userdetails.UserDetails}.
 */
@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceIplTest {

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private UserDetailsService userDetailsService;

  @InjectMocks
  private AuthServiceIpl underTest;

  /**
   * Verifies that a user is successfully authenticated and the correct
   * {@link org.springframework.security.core.userdetails.UserDetails} is returned.
   */
  @Test
  void itShouldAuthenticateUser() {
    User user = TestData.createTestUser();
    String username = user.getUsername();
    String key = user.getKey();

    UserDetails userDetails = new CustomUserDetails(user);

    when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

    UserDetails result = underTest.authenticate(username, key);

    verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

    assertEquals(userDetails.getUsername(), result.getUsername());

  }

}
