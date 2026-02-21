package org.devtiro.chatex.services;

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

    User findByUsername(String username);

    User updateUser(User userToUpdate, UpdateUserDto updateUserDto);

}
