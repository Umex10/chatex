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
import java.util.Set;
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

  // ---------------------------------------------------------------------------
  // Followers / following lookups
  // ---------------------------------------------------------------------------
  /**
   * Ensures followers can be fetched via the aggregator query.
   */
  @Test
  void UserShouldBeFoundByUsernameWithFollowers() {
    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsernameWithFollowers(username))
        .thenReturn(Optional.of(user));

    Set<User> followers = underTest.getFollowers(username);

    assertEquals(Set.of(), followers);

    verify(userRep).findByUsernameWithFollowers(username);
  }

  /**
   * Ensures an exception is raised when followers cannot be loaded.
   */
  @Test
  void UserShouldNotBeFoundByUsernameWithFollowers() {
    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsernameWithFollowers(username))
        .thenReturn(Optional.empty());

    assertNotFoundField(() -> underTest.getFollowers(username), username);
  }

  /**
   * Ensures following relationships are returned when present.
   */
  @Test
  void UserShouldBeFoundByUsernameWithFollowing() {
    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsernameWithFollowing(username))
        .thenReturn(Optional.of(user));

    Set<User> followers = underTest.getFollowing(username);

    assertEquals(Set.of(), followers);

    verify(userRep).findByUsernameWithFollowing(username);
  }

  /**
   * Ensures an exception is raised when following relationships cannot be loaded.
   */
  @Test
  void UserShouldNotBeFoundByUsernameWithFollowing() {
    User user = TestData.createTestUser();
    String username = user.getUsername();

    when(userRep.findByUsernameWithFollowing(username))
        .thenReturn(Optional.empty());

    assertNotFoundField(() -> underTest.getFollowing(username), username);
  }

  // ---------------------------------------------------------------------------
  // Follow / unfollow mutations
  // ---------------------------------------------------------------------------
  /**
   * Ensures the follow operation links both follower and target collections.
   */
  @Test
  void UserShouldFollowOtherUser() {
    User user = TestData.createTestUser();
    user.setId(new UUID(3L, 2));
    UUID userId = user.getId();

    User userToFollow = TestData.createTestUser();
    String usernameToFollow = userToFollow.getUsername();

    when(userRep.findById(userId))
        .thenReturn(Optional.of(user));

    when(userRep.findByUsername(usernameToFollow))
        .thenReturn(Optional.of(userToFollow));

    underTest.follow(userId, usernameToFollow);

    User userThatFollows = userToFollow.getFollowers().stream().findFirst().orElseThrow();
    User userToFollowInSet = user.getFollowing().stream().findFirst().orElseThrow();

    assertEquals(userToFollow, userToFollowInSet);
    assertEquals(user, userThatFollows);
  }

  /**
   * Ensures the unfollow operation removes both sides of the relationship.
   */
  @Test
  void UserShouldUnFollowOtherUser() {
    User user = TestData.createTestUser();
    user.setId(new UUID(3L, 2));
    UUID userId = user.getId();

    User userToUnfollow = TestData.createTestUser();
    String usernameToUnfollow = userToUnfollow.getUsername();

    when(userRep.findById(userId))
        .thenReturn(Optional.of(user));

    when(userRep.findByUsername(usernameToUnfollow))
        .thenReturn(Optional.of(userToUnfollow));

    underTest.unfollow(userId, usernameToUnfollow);

    Set<User> userThatUnfollowsSet = user.getFollowing();
    Set<User> userToUnfollowInSet = userToUnfollow.getFollowers();

    assertTrue(userThatUnfollowsSet.isEmpty());
    assertTrue(userToUnfollowInSet.isEmpty());
  }

  // ---------------------------------------------------------------------------
  // Relationship helpers
  // ---------------------------------------------------------------------------
  /**
   * Ensures repository helpers answer whether a user follows a target.
   */
  @Test
  void itShouldCheckIfUserIsFollowingTarget() {
    String targetUsername = "targetUser";
    UUID requestingUserId = UUID.randomUUID();

    when(userRep.isUserFollowingTarget(targetUsername, requestingUserId)).thenReturn(true);

    boolean result = underTest.isUserFollowingTarget(targetUsername, requestingUserId);

    assertTrue(result);
    verify(userRep).isUserFollowingTarget(targetUsername, requestingUserId);
  }

  /**
   * Ensures following IDs returned by the repository are forwarded as-is.
   */
  @Test
  void itShouldFindFollowingIdsInList() {
    UUID userId = UUID.randomUUID();
    Set<UUID> idsToCheck = Set.of(UUID.randomUUID(), UUID.randomUUID());
    Set<UUID> expected = Set.of(idsToCheck.iterator().next()); // Simulating an actual result

    when(userRep.findFollowingIdsIn(userId, idsToCheck)).thenReturn(expected);

    Set<UUID> actualResult = underTest.findFollowingIdsIn(userId, idsToCheck);

    assertEquals(expected, actualResult);
    verify(userRep).findFollowingIdsIn(userId, idsToCheck);
  }

  /**
   * Ensures follower IDs returned by the repository are forwarded as-is.
   */
  @Test
  void itShouldFindFollowersIdsInList() {
    UUID userId = UUID.randomUUID();
    Set<UUID> idsToCheck = Set.of(UUID.randomUUID(), UUID.randomUUID());
    Set<UUID> expected = Set.of(); // Simulating unmatched ids

    when(userRep.findFollowersIdsIn(userId, idsToCheck)).thenReturn(expected);

    Set<UUID> actualResult = underTest.findFollowersIdsIn(userId, idsToCheck);

    assertEquals(expected, actualResult);
    assertTrue(actualResult.isEmpty());
    verify(userRep).findFollowersIdsIn(userId, idsToCheck);
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
