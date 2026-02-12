package org.devtiro.chatex.reps;

import org.devtiro.chatex.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity database operations.
 * Provides methods for querying and checking user existence by various criteria.
 */
@Repository
public interface UserRep extends JpaRepository<User, UUID> {

    /**
     * Finds a user by their username.
     *
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a user exists with the given username.
     *
     * @return true if user exists, false otherwise
     */
    boolean existsUserByUsername(String username);

    /**
     * Checks if a user exists with the given email.
     *
     * @return true if user exists, false otherwise
     */
    boolean existsUserByEmail(String email);

    /**
     * Checks if a user exists with the given phone number.
     *
     * @return true if user exists, false otherwise
     */
    boolean existsUserByPhone(String phone);
}
