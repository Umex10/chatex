package org.devtiro.chatex.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;

/**
 * Service interface for user management operations.
 * Provides methods for creating and retrieving user accounts.
 */
public interface UserService {

    /**
     * Creates a new user account from the sign-up request data.
     *
     * @return the created User entity
     */
    User createAccount(SignUpAccountRequestDto signUpAccountRequestDto);

    /**
     * Finds a user by their unique identifier.
     *
     * @return the User entity
     */
    User findById(UUID userId);

    /**
     * Finds a user by their username.
     *
     * @return the User entity
     */
    User findByUsername(String username);

    /**
     * Updates a user's profile details with the provided data.
     *
     * @return the updated and persisted User entity
     */
    User updateUser(User userToUpdate, UpdateUserDto updateUserDto);

    /**
     * Returns all users who follow the user with the given username.
     * Loads the followers via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that follow the target user
     */
    Set<User> getFollowers(String username);

    /**
     * Returns all users that the user with the given username is following.
     * Loads the following list via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that the target user follows
     */
    Set<User> getFollowing(String username);

    /**
     * Creates a follow relationship from the user identified by {@code userId}
     * to the user identified by {@code usernameToFollow}.
     *
     */
    void follow(UUID userId, String usernameToFollow);

    /**
     * Removes the follow relationship between the user identified by {@code userId}
     * and the user identified by {@code usernameToFollow}.
     *
     */
    void unfollow(UUID userId, String usernameToFollow);

    /**
     * Checks whether the requesting user is already following the target user.
     *
     * @return {@code true} if the requesting user follows the target, {@code false} otherwise
     */
    boolean isUserFollowingTarget(String targetUsername, UUID requestingUserId);

    /**
     * Returns the subset of {@code idsInList} that the given user is following.
     * Used for mass status checks to avoid the n+1 problem.
     *
     * @return a Set of UUIDs from {@code idsInList} that the user follows
     */
    Set<UUID> findFollowingIdsIn(UUID userId, Set<UUID> idsInList);

    /**
     * Returns the subset of {@code idsInList} that are following the given user.
     * Used for mass status checks to avoid the n+1 problem.
     *
     * @return a Set of UUIDs from {@code idsInList} that follow the user
     */
    Set<UUID> findFollowersIdsIn(UUID userId, Set<UUID> idsInList);

    List<FollowDto> handleFollowBadges(UUID userId, Set<User> users);

}
