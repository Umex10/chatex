package org.devtiro.chatex.reps;

import org.devtiro.chatex.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Repository interface for User entity database operations.
 * Provides methods for querying and checking user existence by various
 * criteria.
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

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.followers WHERE u.username = :username")
    Optional<User> findByUsernameWithFollowers(@Param("username") String username);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.following WHERE u.username = :username")
    Optional<User> findByUsernameWithFollowing(@Param("username") String username);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.followers f WHERE u.username = :targetUsername AND f.id = :requestingUserId")
    boolean isUserFollowingTarget(
            @Param("targetUsername") String targetUsername,
            @Param("requestingUserId") UUID requestingUserId);

    @Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findFollowingIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

    @Query("SELECT f.id FROM User u JOIN u.followers f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findFollowersIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

}
