package org.devtiro.chatex.services.ipl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.FollowMapper;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.FollowService;
import org.springframework.stereotype.Service;

/**
 * Implementation of the FollowService interface.
 * Handles follow relationship operations including follow/unfollow actions,
 * relationship queries, and follow-status badge enrichment.
 */
@Service
@RequiredArgsConstructor
public class FollowServiceIpl implements FollowService {

    private final UserRep userRep;
    private final FollowMapper followMapper;

    /**
     * Returns all users who follow the user with the given username.
     * Loads the followers via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that follow the target user
     * @throws EntityNotFoundException if no user exists with the given username
     */
    @Override
    public Set<User> getFollowers(String username) {
        User user = userRep.findByUsernameWithFollowers(username).orElseThrow(
                () -> new EntityNotFoundException("The user with the username: " + username + " was not found"));

        return user.getFollowers();
    }

    /**
     * Returns all users that the user with the given username is following.
     * Loads the following list via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that the target user follows
     * @throws EntityNotFoundException if no user exists with the given username
     */
    @Override
    public Set<User> getFollowing(String username) {
        User user = userRep.findByUsernameWithFollowing(username).orElseThrow(
                () -> new EntityNotFoundException("The user with the username: " + username + " was not found"));

        return user.getFollowing();
    }

    /**
     * Creates a follow relationship from the user identified by {@code userId}
     * to the user identified by {@code usernameToFollow}.
     * Both sides of the bidirectional Set are updated in a single transaction.
     *
     * @throws EntityNotFoundException if either user cannot be found
     */
    @Override
    @Transactional
    public void follow(UUID userId, String usernameToFollow) {

        User user = userRep.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("The user with the userId: " + userId + " was not found"));

        User userToFollow = userRep.findByUsername(usernameToFollow).orElseThrow(
                () -> new EntityNotFoundException(
                        "The user with the username: " + usernameToFollow + " was not found"));

        user.getFollowing().add(userToFollow);
        userToFollow.getFollowers().add(user);
    }

    /**
     * Removes the follow relationship between the user identified by {@code userId}
     * and the user identified by {@code usernameToFollow}.
     * Both sides of the bidirectional Set are updated in a single transaction.
     *
     * @throws EntityNotFoundException if either user cannot be found
     */
    @Override
    @Transactional
    public void unfollow(UUID userId, String usernameToFollow) {
        User user = userRep.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("The user with the userId: " + userId + " was not found"));

        User userToUnfollow = userRep.findByUsername(usernameToFollow).orElseThrow(
                () -> new EntityNotFoundException(
                        "The user with the username: " + usernameToFollow + " was not found"));

        user.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(user);
    }

    /**
     * Checks whether the requesting user is already following the target user.
     * Delegates directly to the repository's COUNT-based query.
     *
     * @return {@code true} if the requesting user follows the target, {@code false}
     *         otherwise
     */
    @Override
    public boolean isUserFollowingTarget(String targetUsername, UUID requestingUserId) {
        return userRep.isUserFollowingTarget(targetUsername, requestingUserId);
    }

    /**
     * Returns the subset of {@code idsInList} that the given user is following.
     * Used for mass status checks to avoid the n+1 problem when rendering follow
     * badges.
     *
     * @return a Set of UUIDs from {@code idsInList} that the user follows
     */
    @Override
    public Set<UUID> findFollowingIdsIn(UUID userId, Set<UUID> idsInList) {
        return userRep.findFollowingIdsIn(userId, idsInList);
    }

    /**
     * Returns the subset of {@code idsInList} that are following the given user.
     * Used for mass status checks to avoid the n+1 problem when rendering follow
     * badges.
     *
     * @return a Set of UUIDs from {@code idsInList} that follow the user
     */
    @Override
    public Set<UUID> findFollowersIdsIn(UUID userId, Set<UUID> idsInList) {
        return userRep.findFollowersIdsIn(userId, idsInList);
    }

    /**
     * Enriches a set of users with follow-status badges relative to the requesting
     * user.
     * Uses a single batch IN-query to avoid the n+1 problem: instead of querying
     * the
     * database once per user in {@code users}, it collects all IDs and performs two
     * bulk lookups (who I follow, who follows me).
     *
     * @return a list of FollowDto entries with {@code userFollowingTarget} and
     *         {@code targetFollowingUser} flags set
     */
    @Override
    public List<FollowDto> handleFollowBadges(UUID userId, Set<User> users) {
        Set<UUID> idsInList = users.stream().map(User::getId).collect(Collectors.toSet());

        Set<UUID> followedMe = findFollowersIdsIn(userId, idsInList);
        Set<UUID> followedByMe = findFollowingIdsIn(userId, idsInList);

        List<FollowDto> followingDto = followMapper.toDtoList(users);

        followingDto.forEach(dto -> dto.setTargetFollowingUser(followedMe.contains(dto.getId())));
        followingDto.forEach(dto -> dto.setUserFollowingTarget(followedByMe.contains(dto.getId())));

        return followingDto;
    }

}
