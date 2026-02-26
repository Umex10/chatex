package org.devtiro.chatex.services;

import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
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

    Set<User> getFollowers(String username);

    Set<User> getFollowing(String username);

    void follow(UUID userId, String usernameToFollow);

    void unfollow(UUID userId, String usernameToFollow);

    boolean isUserFollowingTarget(String targetUsername, UUID requestingUserId);

    Set<UUID> findFollowingIdsIn(UUID userId, Set<UUID> idsInList);

    Set<UUID> findFollowersIdsIn(UUID userId, Set<UUID> idsInList);

}
