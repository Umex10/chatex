package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.services.FollowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling follow relationship operations.
 * Provides endpoints for retrieving follower/following lists and managing
 * follow/unfollow actions.
 */
@RestController
@RequestMapping(path = "/api/v1/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // ==========================================
    // QUERIES (GET)
    // ==========================================

    /**
     * Retrieves the list of followers for the user with the given username.
     * Each entry is enriched with follow-status badges relative to the requesting
     * user.
     *
     * @param userId   the ID of the requesting user (auth token)
     * @param username the target username whose followers are being retrieved
     * @return ResponseEntity containing a list of FollowDto entries with badge
     *         flags
     */
    @GetMapping(path = "/{username}/followers")
    public ResponseEntity<List<FollowDto>> getFollowers(@RequestAttribute("userId") UUID userId,
            @PathVariable String username) {
        Set<User> followers = followService.getFollowers(username);
        List<FollowDto> followersDto = followService.handleFollowBadges(userId, followers);
        return ResponseEntity.ok(followersDto);
    }

    /**
     * Searches for active users by their username pattern to explore new follow connections.
     * Enriches the response with the follow status between the requester and found users.
     *
     * @param query  the partial or full username to search for
     * @param userId the ID of the requesting user
     * @return ResponseEntity containing matching users wrapped in FollowDto
     */
    @GetMapping(path = "/searchFollows")
    public ResponseEntity<List<FollowDto>> searchUsers(@RequestParam String query,
            @RequestAttribute UUID userId) {
        Set<User> followInstances = followService.searchFollowResultByUsername(query, userId);
        List<FollowDto> followInstancesDto = followService.handleFollowBadges(userId, followInstances);

        return new ResponseEntity<>(followInstancesDto, HttpStatus.OK);
    }

    /**
     * Fetches suggested users (recommendations) for the authenticated user.
     * Typically prioritizes users that might be interesting to follow.
     *
     * @param query  the search payload or empty string for default recommendations
     * @param userId the ID of the requesting user
     * @return ResponseEntity with recommended users as FollowDto list
     */
    @GetMapping(path = "/searchRecommendations")
    public ResponseEntity<List<FollowDto>> searchRecommendations(@RequestParam String query,
            @RequestAttribute UUID userId) {
        Set<User> followInstances = followService.searchFollowRecommendationByUsername(query, userId);
        List<FollowDto> followInstancesDto = followService.handleFollowBadges(userId, followInstances);

        return new ResponseEntity<>(followInstancesDto, HttpStatus.OK);
    }

    /**
     * Retrieves the list of users that the given user is following.
     * Each entry is enriched with follow-status badges relative to the requesting
     * user.
     *
     * @param userId   the ID of the requesting user (auth token)
     * @param username the target username whose following list is being retrieved
     * @return ResponseEntity containing a list of FollowDto entries with badge
     *         flags
     */
    @GetMapping(path = "/{username}/following")
    public ResponseEntity<List<FollowDto>> getFollowing(@RequestAttribute("userId") UUID userId,
            @PathVariable String username) {
        Set<User> following = followService.getFollowing(username);
        List<FollowDto> followingDto = followService.handleFollowBadges(userId, following);
        return ResponseEntity.ok(followingDto);
    }

    // ==========================================
    // MUTATIONS (POST)
    // ==========================================

    /**
     * Follows the user identified by {@code username} on behalf of the
     * authenticated user.
     *
     * @param userId   the ID of the requesting user who is executing the follow
     *                 action
     * @param username the target username to be followed
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{username}/follow")
    public ResponseEntity<Void> follow(@RequestAttribute UUID userId, @PathVariable String username) {
        followService.follow(userId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Unfollows the user identified by {@code username} on behalf of the
     * authenticated user.
     *
     * @param userId   the ID of the requesting user who is executing the unfollow
     *                 action
     * @param username the target username to be unfollowed
     * @return ResponseEntity with HTTP 200 OK and an empty body
     */
    @PostMapping(path = "/{username}/unfollow")
    public ResponseEntity<Void> unfollow(@RequestAttribute UUID userId, @PathVariable String username) {
        followService.unfollow(userId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
