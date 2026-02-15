package org.devtiro.chatex.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Unit tests for {@link CustomUserDetailsService}.
 * Validates user loading behavior for both existing and non-existing usernames.
 */
@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

  @Mock
  private UserRep userRep;

  @InjectMocks
  private CustomUserDetailsService customUserDetailsService;

  /**
   * Verifies that a user is successfully loaded by username and the returned
   * {@link org.springframework.security.core.userdetails.UserDetails} contains the correct username.
   */
  @Test
  void itShouldLoadUserByUsername() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsername(username)).thenReturn(Optional.of(user));

    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

    assertNotNull(userDetails);

    assertEquals(username, userDetails.getUsername());

  }

  /**
   * Verifies that a {@link org.springframework.security.core.userdetails.UsernameNotFoundException}
   * is thrown when no user exists with the given username.
   */
  @Test
  void itShouldNotLoadUserByUsername() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsername(username)).thenReturn(Optional.empty());

    assertThrows(UsernameNotFoundException.class,
        () -> customUserDetailsService.loadUserByUsername(username));

  }
}
