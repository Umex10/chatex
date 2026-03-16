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

    Set<User> findByUsernameContainingIgnoreCaseAndUsernameNot(
            String searchUsername,
            String myUsername);

    Set<User> findFirst3ByUsernameStartingWithIgnoreCaseAndUsernameNot(
            String searchUsername,
            String myUsername);

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

    /**
     * Loads a user together with their full followers set in a single JOIN FETCH
     * query.
     * Avoids the n+1 problem when caller needs to access
     * {@code user.getFollowers()}.
     *
     * @return Optional containing the user with followers eagerly loaded, or empty
     *         if not found
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.followers WHERE u.username = :username")
    Optional<User> findByUsernameWithFollowers(@Param("username") String username);

    /**
     * Loads a user together with their full following set in a single JOIN FETCH
     * query.
     * Avoids the n+1 problem when caller needs to access
     * {@code user.getFollowing()}.
     *
     * @return Optional containing the user with following list eagerly loaded, or
     *         empty if not found
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.following WHERE u.username = :username")
    Optional<User> findByUsernameWithFollowing(@Param("username") String username);

    /**
     * Checks whether {@code userId} is among the followers of the user identified
     * by {@code targetUsername}. Uses a lightweight {@code COUNT} check to avoid
     * loading full entity graphs.
     *
     * @return {@code true} if the authenticated user follows the target,
     *         {@code false} otherwise
     */
    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.followers f WHERE u.username = :targetUsername AND f.id = :userId")
    boolean isUserFollowingTarget(
            @Param("targetUsername") String targetUsername,
            @Param("userId") UUID userId);

    /**
     * Checks whether the user identified by {@code targetUsername} is following
     * the user identified by {@code userId}.
     *
     * @return {@code true} if the target follows the authenticated user,
     *         {@code false} otherwise
     */
    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.followers f WHERE u.id = :userId AND f.username = :targetUsername")
    boolean isTargetFollowingUser(
            @Param("targetUsername") String targetUsername,
            @Param("userId") UUID userId);

    /**
     * Returns the subset of {@code targetIds} that the user identified by
     * {@code myId}
     * is following. Used for mass badge checks to avoid the n+1 problem.
     * Only UUIDs, not full entities, are returned to minimise memory and network
     * overhead.
     *
     * @return a Set of UUIDs from {@code targetIds} that the user follows
     */
    @Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findFollowingIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

    /**
     * Returns the subset of {@code targetIds} that are following the user
     * identified
     * by {@code myId}. Used for mass badge checks to avoid the n+1 problem.
     * Only UUIDs, not full entities, are returned to minimise memory and network
     * overhead.
     *
     * @return a Set of UUIDs from {@code targetIds} that follow the user
     */
    @Query("SELECT f.id FROM User u JOIN u.followers f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findFollowersIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

     @Query("SELECT f.id FROM User u JOIN u.silencedUsers f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findSilencedUsersIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

     @Query("SELECT f.id FROM User u JOIN u.silencedBy f WHERE u.id = :myId AND f.id IN :targetIds")
    Set<UUID> findSilencedByUsersIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.silencedUsers s WHERE u.id = :userId AND s.username = :targetUsername")
    boolean isUserSilencingTarget(
            @Param("targetUsername") String targetUsername,
            @Param("userId") UUID userId);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.silencedBy s WHERE u.id = :userId AND s.username = :targetUsername")
    boolean isTargetSilencingUser(
            @Param("targetUsername") String targetUsername,
            @Param("userId") UUID userId);

}
