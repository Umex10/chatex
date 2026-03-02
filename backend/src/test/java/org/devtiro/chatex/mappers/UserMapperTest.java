package org.devtiro.chatex.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import java.util.Set;

import org.devtiro.chatex.TestData;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.domain.mappers.UserMapperImpl;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for {@link UserMapper}.
 * Uses a spy of {@link UserMapperImpl} to verify that helper methods
 * are invoked correctly during entity-to-DTO mapping and that
 * follower/following counts are calculated as expected.
 */
public class UserMapperTest {

  // We will watch this class
  private UserMapper mapper = spy(new UserMapperImpl()); 

  /**
   * Verifies that the mapper correctly calculates the followers count
   * and invokes the {@link UserMapper#calculateFollowersCount(Set)} method
   * when mapping a user with one follower.
   */
  @Test
  void shouldCalculateFollowersCount() {

    User user1 = TestData.createTestUser();
    User user2 = TestData.createTestUser();

    Set<User> followers = Set.of(user2);
    user1.setFollowers(followers);

    UserDto userDto = mapper.toDto(user1);

    verify(mapper).calculateFollowersCount(followers);

    assertEquals(userDto.getFollowersCount(), 1);

  }

  /**
   * Verifies that the mapper correctly calculates the followers count as zero
   * when the user has no followers (null followers set).
   */
  @Test
  void shouldCalculateFollowersCountToZero() {

    User user = TestData.createTestUser();

    user.setFollowers(null);

    UserDto userDto = mapper.toDto(user);

    verify(mapper).calculateFollowersCount(null);

    assertEquals(userDto.getFollowersCount(), 0);

  }

  /**
   * Verifies that the mapper correctly calculates the following count
   * and invokes the {@link UserMapper#calculateFollowingCount(Set)} method
   * when mapping a user who is following one other user.
   */
  @Test
  void shouldCalculateFollowingCount() {

    User user1 = TestData.createTestUser();
    User user2 = TestData.createTestUser();

    Set<User> following = Set.of(user2);
    user1.setFollowing(following);

    UserDto userDto = mapper.toDto(user1);

    verify(mapper).calculateFollowingCount(following);

    assertEquals(userDto.getFollowingCount(), 1);

  }

  /**
   * Verifies that the mapper correctly calculates the following count as zero
   * when the user is not following anyone (null following set).
   */
  @Test
  void shouldCalculateFollowingCountToZero() {

    User user = TestData.createTestUser();

    user.setFollowing(null);

    UserDto userDto = mapper.toDto(user);

    verify(mapper).calculateFollowingCount(null);

    assertEquals(userDto.getFollowingCount(), 0);

  }

}
