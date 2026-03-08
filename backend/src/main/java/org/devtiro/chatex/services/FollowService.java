package org.devtiro.chatex.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;

/**
 * Service interface for follow relationship operations.
 * Provides methods for managing and querying follow/unfollow actions between users.
 */
public interface FollowService {

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

    /**
     * Enriches a set of users with follow-status badges relative to the requesting user.
     * Performs batch lookups to avoid the n+1 problem when rendering follow lists.
     *
     * @return a list of FollowDto entries with badge flags set
     */
    List<FollowDto> handleFollowBadges(UUID userId, Set<User> users);

}
