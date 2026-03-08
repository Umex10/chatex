package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.responses.FollowDto;

import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * REST controller handling user profile operations.
 * Provides endpoints for retrieving and updating user account data.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/follow")
@RequiredArgsConstructor
public class FollowController {

  private final UserService userService;

  /**
   * Retrieves the list of followers for the user with the given username.
   * Each entry is enriched with follow-status badges relative to the requesting user.
   *
   * @return ResponseEntity containing a list of FollowDto entries with badge flags
   */
  @GetMapping(path = "/{username}/followers")
  public ResponseEntity<List<FollowDto>> getFollowers(@RequestAttribute("userId") UUID userId,
      @PathVariable String username) {
    Set<User> followers = userService.getFollowers(username);

    List<FollowDto> followersDto = userService.handleFollowBadges(userId, followers);

    return ResponseEntity.ok(followersDto);
  }

  /**
   * Retrieves the list of users that the given user is following.
   * Each entry is enriched with follow-status badges relative to the requesting user.
   *
   * @return ResponseEntity containing a list of FollowDto entries with badge flags
   */
  @GetMapping(path = "/{username}/following")
  public ResponseEntity<List<FollowDto>> getFollowing(@RequestAttribute("userId") UUID userId,
      @PathVariable String username) {
    Set<User> following = userService.getFollowing(username);

    List<FollowDto> followingDto = userService.handleFollowBadges(userId, following);

    return ResponseEntity.ok(followingDto);
  }

  /**
   * Follows the user identified by {@code username} on behalf of the authenticated user.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{username}/follow")
  public ResponseEntity<Void> follow(@RequestAttribute UUID userId, @PathVariable String username) {

    userService.follow(userId, username);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  /**
   * Unfollows the user identified by {@code username} on behalf of the authenticated user.
   *
   * @return ResponseEntity with HTTP 200 OK and an empty body
   */
  @PostMapping(path = "/{username}/unfollow")
  public ResponseEntity<Void> unfollow(@RequestAttribute UUID userId, @PathVariable String username) {

    userService.unfollow(userId, username);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

}
