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


    /**
     * Returns the set of users recently viewed by the given user.
     *
     * @param userId the ID of the user
     * @return a set of recently viewed User entities
     */
    Set<User> getRecentlyViewedUsers(UUID userId);

    /**
     * Adds a user to the recently viewed list of another user.
     *
     * @param targetUser the user to add
     * @param userId the ID of the viewing user
     */
    void addUserToRecentlyViewedUsersList(User targetUser, UUID userId);

    /**
     * Silences a user for the given user.
     *
     * @param username the username to silence
     * @param userId the ID of the user performing the action
     */
    void silenceUser(String username, UUID userId);

    /**
     * Removes the silence status for a user.
     *
     * @param username the username to unsilence
     * @param userId the ID of the user performing the action
     */
    void unSilenceUser(String username, UUID userId);

    /**
     * Checks if the user is silencing the target user.
     *
     * @param username the target username
     * @param userId the ID of the user
     * @return true if silencing, false otherwise
     */
    boolean isUserSilencingTarget(String username, UUID userId);

    /**
     * Checks if the target user is silencing the user.
     *
     * @param username the target username
     * @param userId the ID of the user
     * @return true if silenced by target, false otherwise
     */
    boolean isTargetSilencingUser(String username, UUID userId);

}
