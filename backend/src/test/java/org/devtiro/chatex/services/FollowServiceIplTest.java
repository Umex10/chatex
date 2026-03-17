package org.devtiro.chatex.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.ipl.FollowServiceIpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityNotFoundException;

/**
 * Unit tests for {@link FollowServiceIpl} covering follow/unfollow mutations,
 * follower/following lookups, and relationship helpers with mocked collaborators.
 */
@ExtendWith(MockitoExtension.class)
public class FollowServiceIplTest {

  @Mock
  private UserRep userRep;

  @InjectMocks
  private FollowServiceIpl underTest;

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

  // /**
  //  * Ensures following IDs returned by the repository are forwarded as-is.
  //  */
  // @Test
  // void itShouldFindFollowingIdsInList() {
  //   UUID userId = UUID.randomUUID();
  //   Set<UUID> idsToCheck = Set.of(UUID.randomUUID(), UUID.randomUUID());
  //   Set<UUID> expected = Set.of(idsToCheck.iterator().next()); // Simulating an actual result

  //   when(userRep.findFollowingIdsIn(userId, idsToCheck)).thenReturn(expected);

  //   Set<UUID> actualResult = underTest.findFollowingIdsIn(userId, idsToCheck);

  //   assertEquals(expected, actualResult);
  //   verify(userRep).findFollowingIdsIn(userId, idsToCheck);
  // }

  // /**
  //  * Ensures follower IDs returned by the repository are forwarded as-is.
  //  */
  // @Test
  // void itShouldFindFollowersIdsInList() {
  //   UUID userId = UUID.randomUUID();
  //   Set<UUID> idsToCheck = Set.of(UUID.randomUUID(), UUID.randomUUID());
  //   Set<UUID> expected = Set.of(); // Simulating unmatched ids

  //   when(userRep.findFollowersIdsIn(userId, idsToCheck)).thenReturn(expected);

  //   Set<UUID> actualResult = underTest.findFollowersIdsIn(userId, idsToCheck);

  //   assertEquals(expected, actualResult);
  //   assertTrue(actualResult.isEmpty());
  //   verify(userRep).findFollowersIdsIn(userId, idsToCheck);
  // }

  /**
   * Shared assertion to check {@link EntityNotFoundException} messages.
   */
  private void assertNotFoundField(Runnable action, String expected) {
    EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
        action::run);

    assertTrue(exception.getMessage().toLowerCase().contains(expected));
  }

}
