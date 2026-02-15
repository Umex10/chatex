package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ipl.UserServiceIpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

/**
 * Unit tests for {@link UserServiceIpl}.
 * Validates account creation logic, duplicate detection, and user lookup operations
 * using mocked dependencies.
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceIplTest {

  @Mock
  private UserRep userRep;

  @Mock
  private PasswordEncoder encoder;

  @InjectMocks
  private UserServiceIpl underTest;

  /**
   * Verifies that a new user account is created successfully
   * when no duplicate username, email, or phone exists.
   */
  @Test
  void itShouldCreateAccount() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    when(encoder.encode(dto.getKey())).thenReturn("Encoded Key");

    String encodedKey = encoder.encode(dto.getKey());

    User editedUser = User.builder()
        .name(dto.getName())
        .username(dto.getUsername())
        .email(dto.getEmail())
        .phone(dto.getPhone())
        .key(encodedKey)
        .build();

    when(userRep.existsUserByUsername(dto.getUsername())).thenReturn(false);
    when(userRep.existsUserByEmail(dto.getEmail())).thenReturn(false);
    when(userRep.existsUserByPhone(dto.getPhone())).thenReturn(false);
    when(userRep.save(editedUser)).thenReturn(editedUser);

    User createUser = underTest.createAccount(dto);

    assertEquals(editedUser.getKey(), createUser.getKey());

  }

  /**
   * Verifies that account creation fails with an {@link jakarta.persistence.EntityExistsException}
   * when the username is already taken.
   */
  @Test
  void itShouldNotCreateAccountWhenUsernameExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByUsername(dto.getUsername())).thenReturn(true),
        "username");
  }

  /**
   * Verifies that account creation fails with an {@link jakarta.persistence.EntityExistsException}
   * when the email is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenEmailExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByEmail(dto.getEmail())).thenReturn(true),
        "email");

  }

  /**
   * Verifies that account creation fails with an {@link jakarta.persistence.EntityExistsException}
   * when the phone number is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenPhoneExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByPhone(dto.getPhone())).thenReturn(true),
        "phone");

  }

  /**
   * Verifies that a user is returned when found by their unique ID.
   */
  @Test
  void UserShouldBeFoundById() {

    User user = TestData.createTestUser();
    user.setId(new UUID(3L, 2));
    UUID userId = user.getId();

    when(userRep.findById(userId))
        .thenReturn(Optional.of(user));

    User findUser = underTest.findById(userId);

    assertEquals(user, findUser);

    verify(userRep).findById(userId);

  }

  /**
   * Verifies that an {@link jakarta.persistence.EntityNotFoundException} is thrown
   * when no user exists with the given ID.
   */
  @Test
  void UserShouldNotBeFoundById() {

    User user = TestData.createTestUser();
    user.setId(new UUID(3L, 2));
    UUID userId = user.getId();

    when(userRep.findById(userId))
        .thenReturn(Optional.empty());

   EntityNotFoundException exception =
            assertThrows(EntityNotFoundException.class,
                    () -> underTest.findById(userId));

    assertTrue(exception.getMessage().toLowerCase().contains(userId.toString()));

    verify(userRep).findById(userId);

  }

  /**
   * Helper method that asserts account creation fails with an
   * {@link jakarta.persistence.EntityExistsException} containing the expected field name.
   * Also verifies that no user is persisted.
   */
  private void assertAccountCreationFails(
      SignUpAccountRequestDto signUpAccountRequestDto,
      Runnable setup,
      String expectedField) {

    setup.run();

    EntityExistsException exception = assertThrows(
        EntityExistsException.class,
        () -> underTest.createAccount(signUpAccountRequestDto));

    assertTrue(exception.getMessage().toLowerCase().contains(expectedField));

    verify(userRep, never()).save(any());

  }

}
