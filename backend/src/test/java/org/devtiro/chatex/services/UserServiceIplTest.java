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
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
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
 * Unit tests for {@link UserServiceIpl} covering validation paths, repository
 * lookups, and relationship helpers with mocked collaborators.
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceIplTest {

  @Mock
  private UserRep userRep;

  @Mock
  private PasswordEncoder encoder;

  @InjectMocks
  private UserServiceIpl underTest;

  // ---------------------------------------------------------------------------
  // Account creation happy path
  // ---------------------------------------------------------------------------
  /**
   * Verifies that a new user account is created successfully
   * when no duplicate username, email, or phone exists.
   */
  @Test
  void itShouldCreateAccount() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();

    when(encoder.encode(requestDto.getKey())).thenReturn("Encoded Key");

    String encodedKey = encoder.encode(requestDto.getKey());

    User editedUser = User.builder()
      .name(requestDto.getName())
      .username(requestDto.getUsername())
      .email(requestDto.getEmail())
      .phone(requestDto.getPhone())
        .key(encodedKey)
        .build();

    when(userRep.existsUserByUsername(requestDto.getUsername())).thenReturn(false);
    when(userRep.existsUserByEmail(requestDto.getEmail())).thenReturn(false);
    when(userRep.existsUserByPhone(requestDto.getPhone())).thenReturn(false);
    when(userRep.save(editedUser)).thenReturn(editedUser);

    User createUser = underTest.createAccount(requestDto);

    assertEquals(editedUser.getKey(), createUser.getKey());

  }

  // ---------------------------------------------------------------------------
  // Account creation validation branches
  // ---------------------------------------------------------------------------
  /**
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the username is already taken.
   */
  @Test
  void itShouldNotCreateAccountWhenUsernameExists() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
      requestDto,
      () -> when(userRep.existsUserByUsername(requestDto.getUsername())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("username")));
  }

  /**
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the email is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenEmailExists() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
      requestDto,
      () -> when(userRep.existsUserByEmail(requestDto.getEmail())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("email")));

  }

  /**
   * Verifies that account creation fails with an
   * {@link jakarta.persistence.EntityExistsException}
   * when the phone number is already registered.
   */
  @Test
  void itShouldNotCreateAccountWhenPhoneExists() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
      requestDto,
      () -> when(userRep.existsUserByPhone(requestDto.getPhone())).thenReturn(true),
        new ArrayList<String>(Arrays.asList("phone")));

  }

  /**
   * Ensures combined uniqueness violations report every conflicting field.
   */
  @Test
  void itShouldNotCreateAccountWithCombinedErrors() {

    SignUpAccountRequestDto requestDto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        requestDto,
        () -> {
          when(userRep.existsUserByUsername(requestDto.getUsername())).thenReturn(true);
          when(userRep.existsUserByEmail(requestDto.getEmail())).thenReturn(true);
          when(userRep.existsUserByPhone(requestDto.getPhone())).thenReturn(true);
        },
        new ArrayList<String>(Arrays.asList("username", "email", "phone")));

  }

  // ---------------------------------------------------------------------------
  // Lookup by ID
  // ---------------------------------------------------------------------------
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

    assertNotFoundField(() -> underTest.findById(userId), user.getId().toString());

  }

  // ---------------------------------------------------------------------------
  // Lookup by username
  // ---------------------------------------------------------------------------
  /**
   * Verifies that a user is returned when found by their username.
   */
  @Test
  void UserShouldBeFoundByUsername() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsername(username))
        .thenReturn(Optional.of(user));

    User findUser = underTest.findByUsername(username);

    assertEquals(user, findUser);

    verify(userRep).findByUsername(username);
  }

  /**
   * Verifies that an {@link jakarta.persistence.EntityNotFoundException} is thrown
   * when no user exists with the given username.
   */
  @Test
  void UserShouldNotBeFoundByUsername() {

    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsername(username))
        .thenReturn(Optional.empty());

    assertNotFoundField(() -> underTest.findByUsername(username), username);

  }

  // ---------------------------------------------------------------------------
  // User updates
  // ---------------------------------------------------------------------------
  /**
   * Verifies that all updatable profile fields are applied to the entity
   * and that the repository save is called exactly once.
   */
  @Test
  void UserShouldBeUpdated() {

    User user = TestData.createTestUser();
    String newName = "new name";
    String newAvatar = "new avatar";
    String newBanner = "new banner";
    String newBio = "new bio";
    String newLocation = "new location";
    String newWebsite = "new website";

    UpdateUserDto updateUserDto = UpdateUserDto.builder()
        .name(newName)
        .avatar(newAvatar)
        .banner(newBanner)
        .bio(newBio)
        .location(newLocation)
        .website(newWebsite)
        .build();

    when(userRep.save(user))
        .thenReturn(user);

    underTest.updateUser(user, updateUserDto);

    assertEquals(updateUserDto.getName(), newName);
    assertEquals(updateUserDto.getAvatar(), newAvatar);
    assertEquals(updateUserDto.getBanner(), newBanner);
    assertEquals(updateUserDto.getBio(), newBio);
    assertEquals(updateUserDto.getLocation(), newLocation);
    assertEquals(updateUserDto.getWebsite(), newWebsite);

    verify(userRep).save(user);
  }

  /**
   * Shared assertion to check {@link EntityNotFoundException} messages.
   */
  private void assertNotFoundField(Runnable action, String expected) {
    EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
        action::run);

    assertTrue(exception.getMessage().toLowerCase().contains(expected));
  }

  /**
   * Helper method that asserts account creation fails with an
   * {@link jakarta.persistence.EntityExistsException} containing the expected
   * field name.
   * Also verifies that no user is persisted.
   */
  private void assertAccountCreationFails(
      SignUpAccountRequestDto requestDto,
      Runnable setup,
      List<String> expectedFields) {

    setup.run();

    OwnException ex = assertThrows(
        OwnException.class,
        () -> underTest.createAccount(requestDto));

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
