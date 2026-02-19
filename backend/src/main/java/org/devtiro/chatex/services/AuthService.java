package org.devtiro.chatex.services;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * Service interface for handling user authentication operations.
 * Provides methods to authenticate users with their credentials.
 */
public interface AuthService {

    /**
     * Authenticates a user with the provided username and password.
     *
     * @return UserDetails object containing authenticated user information
     */
    UserDetails authenticate(String username, String key);

}
