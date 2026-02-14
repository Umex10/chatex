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

@ExtendWith(MockitoExtension.class)
public class UserServiceIplTest {

  @Mock
  private UserRep userRep;

  @Mock
  private PasswordEncoder encoder;

  @InjectMocks
  private UserServiceIpl underTest;

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

  @Test
  void itShouldNotCreateAccountWhenUsernameExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByUsername(dto.getUsername())).thenReturn(true),
        "username");
  }

  @Test
  void itShouldNotCreateAccountWhenEmailExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByEmail(dto.getEmail())).thenReturn(true),
        "email");

  }

  @Test
  void itShouldNotCreateAccountWhenPhoneExists() {

    SignUpAccountRequestDto dto = TestData.createSignUpAccountRequestDto();

    assertAccountCreationFails(
        dto,
        () -> when(userRep.existsUserByPhone(dto.getPhone())).thenReturn(true),
        "phone");

  }

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
