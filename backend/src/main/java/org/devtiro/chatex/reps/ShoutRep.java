package org.devtiro.chatex.reps;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.devtiro.chatex.domain.entities.Shout;
import org.devtiro.chatex.domain.enums.ShoutVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Shout entity database operations.
 * Provides custom JPQL queries for fetching shouts with their engagement data
 * and checking user interaction status.
 */
@Repository
public interface ShoutRep extends JpaRepository<Shout, UUID> {

        /**
         * Finds all authored and re-shouted shouts by a given username, eagerly
         * fetching the author.
         * Results are ordered by creation date in descending order.
         *
         * @return a list of shouts for the specified user
         */
        @Query("SELECT DISTINCT s from Shout s JOIN FETCH s.user LEFT JOIN s.reShoutedBy reShouter" +
                        " WHERE (s.user.username = :username OR reShouter.username = :username)" +
                        " AND s.variant = :variant" +
                        " ORDER BY s.createdAt DESC")
        List<Shout> findAllShoutsByUsernameAndVariant(@Param("username") String username,
                        @Param("variant") ShoutVariant variant);

        @Query("SELECT img FROM Shout s JOIN s.images img WHERE s.user.username = :username ORDER BY s.createdAt DESC")
        List<String> findAllImagesByUsername(@Param("username") String username);

        /**
         * Finds a shout by ID and eagerly fetches the users who liked it.
         *
         * @return Optional containing the shout with its liked-by set, or empty if not
         *         found
         */
        @Query("Select s from Shout s LEFT JOIN FETCH s.likedBy WHERE s.id = :shoutId")
        Optional<Shout> findLikedByUsersByShoutId(@Param("shoutId") UUID shoutId);

        /**
         * Finds a shout by ID and eagerly fetches the users who re-shouted it.
         *
         * @return Optional containing the shout with its re-shouted-by set, or empty if
         *         not found
         */
        @Query("Select s from Shout s LEFT JOIN FETCH s.reShoutedBy WHERE s.id = :shoutId")
        Optional<Shout> findReShoutedByUsersByShoutId(@Param("shoutId") UUID shoutId);

        /**
         * Checks whether a specific user has liked the given shout.
         * Uses a lightweight COUNT check to avoid loading full entity graphs.
         *
         * @return {@code true} if the user liked the shout, {@code false} otherwise
         */
        @Query("Select COUNT(s) > 0 FROM Shout s JOIN s.likedBy u WHERE s.id = :shoutId AND u.id = :userId")
        boolean isUserLikingTheShout(
                        @Param("shoutId") UUID shoutId,
                        @Param("userId") UUID userId);

        /**
         * Checks whether a specific user has re-shouted the given shout.
         * Uses a lightweight COUNT check to avoid loading full entity graphs.
         *
         * @return {@code true} if the user re-shouted the shout, {@code false}
         *         otherwise
         */
        @Query("Select COUNT(s) > 0 FROM Shout s JOIN s.reShoutedBy u WHERE s.id = :shoutId AND u.id = :userId")
        boolean isUserReShoutingTheShout(
                        @Param("shoutId") UUID shoutId,
                        @Param("userId") UUID userId);
}
