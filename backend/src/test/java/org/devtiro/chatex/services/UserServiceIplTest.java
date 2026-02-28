package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.ApiError.FieldError;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.exceptions.OwnException;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ipl.UserServiceIpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.EntityNotFoundException;

/**
 * Unit tests for {@link UserServiceIpl}.
 * Validates account creation logic, duplicate detection, and user lookup
 * operations
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
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the username is already taken.
   */
  @Test
  void itShouldNotCreateAccountWhenUsernameExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByUsername(dto.getUsername())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("username")));
  }

  /**
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the email is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenEmailExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByEmail(dto.getEmail())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("email")));

  }

  /**
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the phone number is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenPhoneExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByPhone(dto.getPhone())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("phone")));

  }

  @Test
  void itShouldNotCreateAccountWithCombinedErrors() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> {
          when(userRep.existsUserByUsername(dto.getUsername())).thenReturn(true);
          when(userRep.existsUserByEmail(dto.getEmail())).thenReturn(true);
          when(userRep.existsUserByPhone(dto.getPhone())).thenReturn(true);
        },
        new ArrayList<String>(Arrays.asList("username", "email", "phone")));

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
   * Verifies that an {@link jakarta.persistence.EntityNotFoundException} is
   * thrown
   * when no user exists with the given ID.
   */
  @Test
  void UserShouldNotBeFoundById() {

    User user = TestData.createTestUser();
    user.setId(new UUID(3L, 2));
    UUID userId = user.getId();

    when(userRep.findById(userId))
        .thenReturn(Optional.empty());

    EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
        () -> underTest.findById(userId));

    assertTrue(exception.getMessage().toLowerCase().contains(userId.toString()));

    verify(userRep).findById(userId);

  }

  /**
   * Helper method that asserts account creation fails with an
   * {@link jakarta.persistence.EntityExistsException} containing the expected
   * field name.
   * Also verifies that no user is persisted.
   */
  private void assertAccountCreationFails(
      SignUpAccountRequestDto signUpAccountRequestDto,
      Runnable setup,
      List<String> expectedFields) {

    setup.run();

    OwnException ex = assertThrows(
        OwnException.class,
        () -> underTest.createAccount(signUpAccountRequestDto));

    List<FieldError> errors = ex.getErrors();

    // For a single field
    if (errors.size() == 1) {
      assertTrue(ex.getErrors().getFirst().getField().contains(expectedFields.getFirst()));
    } else {
      // For 3 fields: username, email and Phone
      for (int i = 0; i < errors.size(); i++) {
        assertTrue(errors.get(i).getField().contains(expectedFields.get(i)));
      }
    }

    verify(userRep, never()).save(any());

  }

}
